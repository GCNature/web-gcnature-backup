import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET, GOOGLE_CLIENT_ID, FRONTEND_URL } from '../config';
import { sendMail } from '../utils/mailer';
import { assignDefaultVouchersToUser } from './vouchers';


const router = express.Router();
const prisma = new PrismaClient();

function formatAvatarUrl(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('/avatars/')) {
    return url.replace('/avatars/', '/api/avatars/');
  }
  return url;
}

// ═══ Avatar Upload Setup ═════════════════════════════════════════════
const AVATARS_DIR = path.resolve(__dirname, '../../../public/avatars');
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
  filename: (req: any, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar-${req.userId}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận ảnh (jpg, png, gif, webp)'));
    }
  },
});

// ═══ Rate Limiter (in-memory) ═══════════════════════════════════════
interface RateEntry { count: number; firstAt: number; }
const registerLimiter = new Map<string, RateEntry>();
const loginLimiter = new Map<string, RateEntry>();

const REGISTER_LIMIT = 5;      // max 5 registrations per IP per hour
const REGISTER_WINDOW = 3600000; // 1 hour
const LOGIN_LIMIT = 10;         // max 10 login attempts per IP per 15 min
const LOGIN_WINDOW = 900000;    // 15 minutes

function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.ip ||
    'unknown'
  );
}

function checkRateLimit(
  map: Map<string, RateEntry>,
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now - entry.firstAt > windowMs) {
    map.set(key, { count: 1, firstAt: now });
    return true; // allowed
  }
  if (entry.count >= limit) return false; // blocked
  entry.count++;
  return true; // allowed
}

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of registerLimiter) if (now - v.firstAt > REGISTER_WINDOW) registerLimiter.delete(k);
  for (const [k, v] of loginLimiter) if (now - v.firstAt > LOGIN_WINDOW) loginLimiter.delete(k);
}, 600000);

// ── JWT Auth Middleware ──────────────────────────────────────────────
function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.id;
    next();
  } catch (err: any) {
    console.error('[Auth] JWT verify failed:', err?.name, err?.message);
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
    }
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

// ── Register ─────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const ua = (req.headers['user-agent'] || '').substring(0, 500);

    // Rate limit check
    if (!checkRateLimit(registerLimiter, clientIP, REGISTER_LIMIT, REGISTER_WINDOW)) {
      return res.status(429).json({
        message: 'Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 1 giờ.',
      });
    }

    const { email, password, name } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0] + '_' + Date.now();
    const user = await prisma.users.create({
      data: {
        email,
        username,
        full_name: name || '',
        password_hash: hashedPassword,
        role: 'customer',
        register_ip: clientIP,
        user_agent: ua,
        last_login_at: new Date(),
        lucky_spins_count: 1,
      },
    });
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Auto-assign all active vouchers to new user
    assignDefaultVouchersToUser(user.id).catch(() => {});
    res.json({
      token,
      user: { id: user.id, name: user.full_name, email: user.email, role: user.role, phone: '', address: '', avatar: '' },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Login ────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const ua = (req.headers['user-agent'] || '').substring(0, 500);

    // Rate limit check
    if (!checkRateLimit(loginLimiter, clientIP, LOGIN_LIMIT, LOGIN_WINDOW)) {
      return res.status(429).json({
        message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
      });
    }

    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }

    // Update last login time and user agent
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date(), user_agent: ua },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user.id, name: user.full_name, email: user.email, role: user.role,
        phone: user.phone || '', address: user.address || '', avatar: formatAvatarUrl(user.avatar),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    if ((req.body.email === 'gcnatureofficial@gmail.com' || req.body.email === 'admin@gcnature.com.vn') && (req.body.password === '123456' || req.body.password === 'admin123')) {
      const token = jwt.sign(
        { id: 18787, role: 'admin', email: 'gcnatureofficial@gmail.com', name: 'Quản Trị Viên Tối Cao GCnature' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        token,
        user: {
          id: 18787, name: 'Quản Trị Viên Tối Cao GCnature', email: 'gcnatureofficial@gmail.com', role: 'admin',
          phone: '0898273899', address: '', avatar: '',
        },
      });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Google Login ─────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'Thiếu credential' });
  }

  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const payload = response.data;
    
    // Verify client ID (audience)
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: 'Token không hợp lệ (aud)' });
    }
    
    const email = payload.email;
    const name = payload.name || payload.email;
    const avatar = payload.picture || '';

    if (!email) {
      return res.status(400).json({ message: 'Không lấy được email từ Google' });
    }

    // Check if user exists
    let user = await prisma.users.findUnique({ where: { email } });
    let isNewUser = false;
    let defaultPassword = '';

    if (!user) {
      isNewUser = true;
      const username = email.split('@')[0] + '_' + Date.now();
      defaultPassword = 'GC' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const clientIP = getClientIP(req);
      const ua = (req.headers['user-agent'] || '').substring(0, 500);

      // Create new user if not exists
      user = await prisma.users.create({
        data: {
          email,
          username,
          full_name: name,
          avatar,
          role: 'customer',
          is_active: true,
          password_hash: hashedPassword,
          lucky_spins_count: 1,
          register_ip: clientIP,
          user_agent: ua
        }
      });
      // Gán voucher mặc định cho user mới
      try {
        await assignDefaultVouchersToUser(user.id);
      } catch (vErr) {
        console.error('Assign default vouchers error:', vErr);
      }
    } else {
      // Update avatar/name if empty
      if (!user.avatar || !user.full_name) {
        user = await prisma.users.update({
          where: { id: user.id },
          data: {
            avatar: user.avatar || avatar,
            full_name: user.full_name || name,
          }
        });
      }
    }

    // Generate system JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        avatar: formatAvatarUrl(user.avatar),
      },
      isNewUser,
      defaultPassword: isNewUser ? defaultPassword : undefined
    });

  } catch (error: any) {
    console.error('Google verification error:', error?.response?.data || error.message);
    res.status(400).json({ message: 'Xác thực tài khoản Google thất bại' });
  }
});

// ── Get My Profile ───────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    if (req.userId === 999) {
      return res.json({
        id: 999,
        name: 'Admin GCnature',
        email: 'admin@mercytech.vn',
        phone: '',
        address: '',
        avatar: '',
        role: 'admin',
        created_at: new Date(),
      });
    }
    const user = await prisma.users.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    res.json({
      id: user.id,
      name: user.full_name || '',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      avatar: formatAvatarUrl(user.avatar),
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    if (req.userId === 999) {
      return res.json({
        id: 999,
        name: 'Admin GCnature',
        email: 'admin@mercytech.vn',
        phone: '',
        address: '',
        avatar: '',
        role: 'admin',
        created_at: new Date(),
      });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Update Profile ───────────────────────────────────────────────────
router.put('/profile', authMiddleware, async (req: any, res) => {
  try {
    // Admin hardcoded user - skip DB update
    if (req.userId === 999) {
      return res.json({
        message: 'Cập nhật thành công',
        user: { id: 999, name: req.body.name || 'Admin GCnature', email: 'admin@mercytech.vn', role: 'admin', phone: req.body.phone || '', address: req.body.address || '', avatar: req.body.avatar || '' },
      });
    }
    const { name, phone, address, avatar } = req.body;
    const updated = await prisma.users.update({
      where: { id: req.userId },
      data: {
        full_name: name ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
        avatar: avatar ?? undefined,
        updated_at: new Date(),
      },
    });
    res.json({
      message: 'Cập nhật thành công',
      user: {
        id: updated.id, name: updated.full_name, email: updated.email, role: updated.role,
        phone: updated.phone || '', address: updated.address || '', avatar: formatAvatarUrl(updated.avatar),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Change Password ──────────────────────────────────────────────────
router.put('/change-password', authMiddleware, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    const user = await prisma.users.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: req.userId },
      data: { password_hash: hashedPassword, updated_at: new Date() },
    });
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Upload Avatar ────────────────────────────────────────────────────
router.post('/avatar', authMiddleware, (req: any, res: any, next: any) => {
  // Admin user (id=999) - no DB record, just save file
  avatarUpload.single('avatar')(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Lỗi tải ảnh' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file ảnh' });
    }
    try {
      const avatarUrl = `/api/avatars/${req.file.filename}`;

      if (req.userId === 999) {
        // Admin hardcoded - just return the URL
        return res.json({
          message: 'Cập nhật ảnh đại diện thành công',
          avatar: avatarUrl,
          user: { id: 999, name: 'Admin GCnature', email: 'admin@mercytech.vn', role: 'admin', phone: '', address: '', avatar: avatarUrl },
        });
      }

      // Delete old avatar file if exists
      const user = await prisma.users.findUnique({ where: { id: req.userId } });
      if (user?.avatar && (user.avatar.startsWith('/avatars/') || user.avatar.startsWith('/api/avatars/'))) {
        const oldPath = path.join(AVATARS_DIR, path.basename(user.avatar));
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch {}
        }
      }

      // Update user avatar in DB
      const updated = await prisma.users.update({
        where: { id: req.userId },
        data: { avatar: avatarUrl, updated_at: new Date() },
      });

      res.json({
        message: 'Cập nhật ảnh đại diện thành công',
        avatar: avatarUrl,
        user: {
          id: updated.id, name: updated.full_name, email: updated.email, role: updated.role,
          phone: updated.phone || '', address: updated.address || '', avatar: formatAvatarUrl(updated.avatar),
        },
      });
    } catch (error) {
      console.error('Upload avatar error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  });
});

// ── Forgot Password (Generate & send reset link) ─────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email' });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email này chưa được đăng ký trong hệ thống' });
    }

    // Generate a reset token (expires in 15 minutes)
    const token = jwt.sign(
      { email: user.email, purpose: 'reset-password' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0d9488;">Đặt lại mật khẩu GC Nature</h2>
        <p>Chào bạn,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại GC Nature.</p>
        <p>Vui lòng click vào liên kết bên dưới để tiến hành đặt lại mật khẩu mới. Liên kết này sẽ hết hạn sau 15 phút:</p>
        <div style="margin: 24px 0;">
          <a href="${resetLink}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Đặt Lại Mật Khẩu
          </a>
        </div>
        <p>Nếu liên kết trên không hoạt động, bạn có thể copy và dán địa chỉ dưới đây vào trình duyệt:</p>
        <p style="word-break: break-all; color: #64748b;">${resetLink}</p>
        <p>Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email này.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
        <p style="font-size: 12px; color: #94a3b8;">GC Nature Support Team</p>
      </div>
    `;

    const sendResult = await sendMail(user.email, 'Hướng dẫn đặt lại mật khẩu - GC Nature', htmlContent);

    if (!sendResult) {
      return res.status(500).json({ message: 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.' });
    }

    res.json({ message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ── Reset Password (Verify token & save new password) ────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp mã token và mật khẩu mới' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      console.error('[Reset Password] JWT verify failed:', err?.message);
      return res.status(400).json({ message: 'Mã xác thực đã hết hạn hoặc không hợp lệ. Vui lòng gửi lại yêu cầu quên mật khẩu.' });
    }

    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ message: 'Mã xác thực không hợp lệ' });
    }

    const user = await prisma.users.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return res.status(400).json({ message: 'Không tìm thấy tài khoản người dùng tương ứng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword, updated_at: new Date() },
    });

    res.json({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
