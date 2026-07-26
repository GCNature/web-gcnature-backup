import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendContactNotification } from '../services/email';
import { isAdmin } from '../middleware/auth';
import rateLimit from 'express-rate-limit';
import { createSystemNotification } from '../utils/notification';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// CV upload directory: public/cvs
const CV_DIR = path.resolve(__dirname, '../../../public/cvs');
if (!fs.existsSync(CV_DIR)) {
  fs.mkdirSync(CV_DIR, { recursive: true });
}

// Multer storage configuration for CVs
const cvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, CV_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitized = file.originalname
      .replace(ext, '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, '-');
    const finalName = `cv-${sanitized}-${Date.now()}${ext}`;
    cb(null, finalName);
  }
});

const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(pdf|png|jpg|jpeg|doc|docx)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận các định dạng file: PDF, PNG, JPG, Word (doc/docx)'));
    }
  }
});

// POST /api/contact/upload-cv - Public endpoint for uploading applicant CV
router.post('/upload-cv', (req, res) => {
  cvUpload.single('cvFile')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file CV để tải lên' });
    }
    const fileUrl = `/cvs/${req.file.filename}`;
    res.json({ success: true, fileUrl });
  });
});

// Rate limit contact form: max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.' },
});

// POST /api/contact - Create new contact request (PUBLIC with rate limit)
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, phone, email, message, street, ward, city, country, requestType } = req.body;

    // Validation
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không hợp lệ' 
      });
    }

    // Phone validation - VN format (10 digits starting with 02, 03, 05, 07, 08, 09)
    const phoneRegex = /^(0[235789])[0-9]{8}$/;
    const cleanPhone = phone.trim().replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số điện thoại không hợp lệ (Phải dài đúng 10 số và bắt đầu bằng đầu số Việt Nam hợp lệ)' 
      });
    }

    // Prepare JSON payload for message column if structured data is provided
    let finalMessage = message.trim();
    const hasStructuredAddress = street || ward || city || country || requestType;
    if (hasStructuredAddress) {
      finalMessage = JSON.stringify({
        street: street?.trim() || '',
        ward: ward?.trim() || '',
        city: city?.trim() || '',
        country: country?.trim() || 'Việt Nam',
        requestType: requestType || 'Thư liên hệ mới',
        message: message.trim()
      });
    }

    // Create contact request
    const contactRequest = await prisma.contact_requests.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim().toLowerCase(),
        message: finalMessage,
        status: 'pending'
      }
    });

    // Create system notification (non-blocking)
    const isAgent = message.trim().startsWith('[ĐĂNG KÝ ĐẠI LÝ]');
    const finalRequestType = requestType || (isAgent ? 'Đăng ký đại lý mới' : 'Thư liên hệ mới');
    let address = [street, ward, city, country].filter(Boolean).join(' - ');
    
    if (!address && isAgent) {
      const areaMatch = message.match(/Khu vực:\s*([^.]+)/);
      if (areaMatch) address = areaMatch[1].trim();
    }

    const notifyPayload = {
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      requestType: finalRequestType,
      address: address || 'Không có',
      message: message.trim()
    };

    const notifyTitle = finalRequestType;
    createSystemNotification('contact_new', notifyTitle, JSON.stringify(notifyPayload)).catch(err => {
      console.error('Failed to log system notification:', err);
    });

    // Send email notification to admin (non-blocking)
    sendContactNotification(contactRequest).catch(err => {
      console.error('Failed to send email notification:', err);
      // Don't fail the request if email fails
    });

    res.status(201).json({
      success: true,
      message: 'Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
      data: {
        id: contactRequest.id,
        created_at: contactRequest.created_at
      }
    });

  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
    });
  }
});

// GET /api/contact - Get all contact requests (Admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact_requests.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.contact_requests.count({ where })
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra' 
    });
  }
});

// PATCH /api/contact/:id - Update contact request status (Admin only)
router.patch('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = new Date();

    const updated = await prisma.contact_requests.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: updated
    });

  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra' 
    });
  }
});

// DELETE /api/contact/:id - Delete contact request (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact_requests.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: 'Đã xóa yêu cầu liên hệ'
    });

  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra' 
    });
  }
});

export default router;
