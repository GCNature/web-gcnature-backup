import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();
import { syncFileToDist } from '../utils/fileSync';

// Configure multer storage for review images
const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const REVIEWS_DIR = path.join(PUBLIC_DIR, 'reviews');

if (!fs.existsSync(REVIEWS_DIR)) {
  fs.mkdirSync(REVIEWS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, REVIEWS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'review-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for review images
});

// Public endpoint to upload a review image
router.post('/upload', upload.single('image'), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Sync file to dist folder for production environment immediately
    syncFileToDist('reviews', req.file.filename);

    const imageUrl = `/reviews/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Review image upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});


// Check if user is eligible to write a review for a specific product
router.get('/can-review/:productId', requireAuth, async (req: any, res: any) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    
    console.log('[CanReviewCheck] Incoming request:', { productId, userId });
    
    if (!userId) {
      console.log('[CanReviewCheck] Unauthorized: No userId present in request');
      return res.json({ canReview: false, reason: 'unauthorized' });
    }
    
    const count = await prisma.orders.count({
      where: {
        user_id: Number(userId),
        status: 'delivered',
        order_items: {
          some: {
            product_id: productId
          }
        }
      }
    });
    
    console.log('[CanReviewCheck] Database match count:', count);
    
    if (count > 0) {
      res.json({ canReview: true });
    } else {
      res.json({ canReview: false, reason: 'not_purchased' });
    }
  } catch (error: any) {
    console.error('[CanReviewCheck] Error during verification:', error?.message || error);
    res.status(500).json({ canReview: false, reason: 'error' });
  }
});

// Get reviews for a specific product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = Number(req.query.limit) || 10;
    
    const reviews = await prisma.product_reviews.findMany({
      where: { product_id: productId, is_active: true },
      orderBy: { sort_order: 'desc' },
      take: limit
    });
    
    const mapped = reviews.map(r => ({
      id: r.id,
      name: r.reviewer_name,
      avatarLetter: r.avatar_letter || r.reviewer_name.charAt(0),
      avatarColor: r.avatar_color || 'bg-red-500',
      rating: r.rating,
      date: r.review_date,
      verified: r.is_verified,
      text: r.review_text,
      helpful: r.helpful_count || 0,
      imageUrl: r.image_url || undefined
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json([]);
  }
});

// Post a review (Authenticated and must have purchased successfully)
router.post('/', requireAuth, async (req: any, res: any) => {
  try {
    const { productId, name, rating, text, image_url } = req.body;
    const userId = req.userId;
    
    if (!productId || !name || !rating || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify purchase eligibility
    const count = await prisma.orders.count({
      where: {
        user_id: Number(userId),
        status: 'delivered',
        order_items: {
          some: {
            product_id: productId
          }
        }
      }
    });
    
    if (count === 0) {
      return res.status(403).json({ error: 'Khách hàng chưa mua sản phẩm này' });
    }
    
    const review = await prisma.product_reviews.create({
      data: {
        product_id: productId,
        reviewer_name: name,
        avatar_letter: name.charAt(0).toUpperCase(),
        rating: Number(rating),
        review_date: new Date().toLocaleDateString('vi-VN'),
        review_text: text,
        image_url: image_url || "",
        is_verified: true, // Auto-verified since purchase is validated
        is_active: true
      }
    });

    res.json({ success: true, id: review.id });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Cannot add review' });
  }
});

export default router;
