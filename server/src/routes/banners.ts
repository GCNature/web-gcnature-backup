import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { isShopManager } from '../middleware/auth';

const router = express.Router();
import { syncFileToDist } from '../utils/fileSync';

// All banner management routes require shop manager authentication
router.use(isShopManager);

// Determine the public directory (project root's public folder)
const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'banners');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Use timestamp + original extension to avoid collisions
    const ext = path.extname(file.originalname);
    const name = `banner-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp, svg)'));
    }
  },
});

// Upload a single banner image
router.post('/upload', upload.single('image'), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Sync file to dist folder for production environment immediately
    syncFileToDist('uploads/banners', req.file.filename);

    // Return the public URL path
    const publicPath = `/uploads/banners/${req.file.filename}`;
    res.json({ url: publicPath, filename: req.file.filename });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// List uploaded banner images
router.get('/list', (_req: any, res: any) => {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      .map(f => ({
        filename: f,
        url: `/uploads/banners/${f}`,
        size: fs.statSync(path.join(UPLOAD_DIR, f)).size,
        modified: fs.statSync(path.join(UPLOAD_DIR, f)).mtime,
      }))
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
    res.json(files);
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json([]);
  }
});

// Delete an uploaded banner image
router.delete('/delete/:filename', (req: any, res: any) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Security: prevent path traversal
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
