import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { JWT_SECRET } from '../config';
import { syncFileToDist, deleteFileFromDist, renameFileInDist } from '../utils/fileSync';
import { isAdmin, isStaff, isShopManager } from '../middleware/auth';

const router = express.Router();

// Determine the public/products directory
const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const PRODUCTS_DIR = path.join(PUBLIC_DIR, 'products');

// Ensure directory exists
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

router.use(isStaff);

// Helper: extract group/SKU prefix from filename
// Supports both naming patterns:
//   "MCK5.0D-0.jpg"  → "MCK5.0D"  (dash pattern)
//   "MCK5.0D.2.png"  → "MCK5.0D"  (dot pattern, legacy production)
//   "MCK5.0D.png"    → "MCK5.0D"  (plain, no number suffix)
function extractGroup(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // strip extension
  // Dash pattern: "SKU-0" → "SKU"
  const dashMatch = nameWithoutExt.match(/^(.+)-\d+$/);
  if (dashMatch) return dashMatch[1];
  // Dot pattern: "SKU.2" → "SKU"
  const dotMatch = nameWithoutExt.match(/^(.+)\.\d+$/);
  if (dotMatch) return dotMatch[1];
  // No number suffix
  return nameWithoutExt;
}

// Configure multer storage safely
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(PRODUCTS_DIR)) {
        fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
      }
      cb(null, PRODUCTS_DIR);
    } catch (err: any) {
      console.error('[Multer] Destination error:', err);
      cb(err, PRODUCTS_DIR);
    }
  },
  filename: (_req, file, cb) => {
    try {
      const rawName = file?.originalname || 'file.png';
      let originalName = rawName;
      try {
        originalName = Buffer.from(rawName, 'latin1').toString('utf8');
      } catch {}
      
      let ext = path.extname(originalName).toLowerCase();
      if (!ext || ext.length > 8) ext = '.png';

      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 100000);
      const cleanBase = path.basename(originalName, ext)
        .replace(/[^\w\d\-]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 30);
      
      const finalName = `${cleanBase || 'upload'}-${timestamp}-${random}${ext}`;
      cb(null, finalName);
    } catch (err: any) {
      console.error('[Multer] Filename error:', err);
      cb(null, `file-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`);
    }
  },
});

// Shared regex for accepted media types
const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
const VIDEO_EXTS = /\.(mp4|webm|mov|avi|mkv)$/i;
const MEDIA_EXTS = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov|avi|mkv)$/i;

function getFileType(filename: string): 'image' | 'video' {
  return VIDEO_EXTS.test(filename) ? 'video' : 'image';
}

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max (video support)
});

// ═══════════════════════════════════
// GET /api/media & GET /api/media/list — List all media (images + videos)
// ═══════════════════════════════════
const listMediaHandler = (_req: any, res: any) => {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return res.json({ success: true, files: [], groups: [], stats: { totalFiles: 0, totalSize: 0 } });
    }

    const allFiles = fs.readdirSync(PRODUCTS_DIR)
      .filter(f => MEDIA_EXTS.test(f));

    let totalSize = 0;
    const files = allFiles.map(f => {
      const filePath = path.join(PRODUCTS_DIR, f);
      const stat = fs.statSync(filePath);
      totalSize += stat.size;
      return {
        filename: f,
        url: `/products/${f}`,
        size: stat.size,
        modified: stat.mtime,
        group: extractGroup(f),
        type: getFileType(f),
      };
    }).sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()); // Newest first!

    // Extract unique groups
    const groupSet = new Set(files.map(f => f.group));
    const groups = Array.from(groupSet).sort();

    res.json({
      success: true,
      files,
      groups,
      stats: {
        totalFiles: files.length,
        totalSize,
      },
    });
  } catch (error) {
    console.error('Media list error:', error);
    res.status(500).json({ success: false, message: 'Lỗi liệt kê ảnh' });
  }
};

router.get('/', listMediaHandler);
router.get('/list', listMediaHandler);

// ═══════════════════════════════════
// POST /api/media/upload — Upload media (images + videos)
// ═══════════════════════════════════
router.post('/upload', (req: any, res: any) => {
  upload.any()(req, res, (err: any) => {
    if (err) {
      console.error('[MediaUpload] Multer error:', err);
      return res.status(200).json({ success: false, message: err.message || 'Lỗi xử lý file tải lên' });
    }

    try {
      const filesArray = req.files || (req.file ? [req.file] : []);
      if (!filesArray || filesArray.length === 0) {
        return res.status(200).json({ success: false, message: 'Không có file nào được chọn' });
      }

      const uploaded = filesArray.map((file: any) => {
        try {
          // Sync file to dist folder for production environment immediately
          syncFileToDist('products', file.filename);
        } catch (syncErr) {
          console.error('[MediaUpload] Sync error:', syncErr);
        }
        return {
          filename: file.filename,
          url: `/products/${file.filename}`,
          size: file.size,
          type: getFileType(file.filename),
        };
      });

      const firstUrl = uploaded[0]?.url;

      return res.status(200).json({
        success: true,
        message: `Đã tải lên thành công ${uploaded.length} tệp`,
        url: firstUrl,
        fileUrl: firstUrl,
        files: uploaded,
      });
    } catch (error: any) {
      console.error('[MediaUpload] Processing error:', error);
      return res.status(200).json({ success: false, message: 'Lỗi tải ảnh lên: ' + (error?.message || 'Lỗi server') });
    }
  });
});

// ═══════════════════════════════════
// PUT /api/media/rename — Rename a file
// ═══════════════════════════════════
router.put('/rename', (req: any, res: any) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
      return res.status(400).json({ message: 'Thiếu tên file cũ hoặc mới' });
    }

    const oldPath = path.join(PRODUCTS_DIR, oldName);
    const newPath = path.join(PRODUCTS_DIR, newName);

    // Security: prevent path traversal
    if (!oldPath.startsWith(PRODUCTS_DIR) || !newPath.startsWith(PRODUCTS_DIR)) {
      return res.status(400).json({ message: 'Tên file không hợp lệ' });
    }

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ message: 'File không tồn tại' });
    }

    if (fs.existsSync(newPath)) {
      return res.status(400).json({ message: 'File với tên mới đã tồn tại' });
    }

    fs.renameSync(oldPath, newPath);
    res.json({
      message: 'Đã đổi tên thành công',
      oldName,
      newName,
      url: `/products/${newName}`,
    });
  } catch (error) {
    console.error('Media rename error:', error);
    res.status(500).json({ message: 'Lỗi đổi tên file' });
  }
});

// ═══════════════════════════════════
// DELETE /api/media/delete/:filename — Delete a file
// ═══════════════════════════════════
router.delete('/delete/:filename', isShopManager, (req: any, res: any) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(PRODUCTS_DIR, filename);

    // Security: prevent path traversal
    if (!filePath.startsWith(PRODUCTS_DIR)) {
      return res.status(400).json({ message: 'Tên file không hợp lệ' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File không tồn tại' });
    }

    fs.unlinkSync(filePath);
    deleteFileFromDist('products', filename);
    res.json({ message: 'Đã xóa ảnh', filename });
  } catch (error) {
    console.error('Media delete error:', error);
    res.status(500).json({ message: 'Lỗi xóa file' });
  }
});

// ═══════════════════════════════════
// POST /api/media/bulk-delete — Delete multiple files
// ═══════════════════════════════════
router.post('/bulk-delete', isShopManager, (req: any, res: any) => {
  try {
    const { filenames } = req.body;
    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ message: 'Danh sách file trống' });
    }

    let deleted = 0;
    let errors: string[] = [];

    for (const filename of filenames) {
      const filePath = path.join(PRODUCTS_DIR, filename);
      if (!filePath.startsWith(PRODUCTS_DIR)) {
        errors.push(`${filename}: tên không hợp lệ`);
        continue;
      }
      if (!fs.existsSync(filePath)) {
        errors.push(`${filename}: không tồn tại`);
        continue;
      }
      try {
        fs.unlinkSync(filePath);
        deleteFileFromDist('products', filename);
        deleted++;
      } catch (e) {
        errors.push(`${filename}: lỗi xóa`);
      }
    }

    res.json({
      message: `Đã xóa ${deleted}/${filenames.length} ảnh`,
      deleted,
      errors,
    });
  } catch (error) {
    console.error('Media bulk delete error:', error);
    res.status(500).json({ message: 'Lỗi xóa file' });
  }
});

// POST /api/media/bulk-move — Move multiple files to another group/SKU prefix
router.post('/bulk-move', (req: any, res: any) => {
  try {
    const { filenames, newGroup } = req.body;
    if (!filenames || !Array.isArray(filenames) || filenames.length === 0 || !newGroup) {
      return res.status(400).json({ message: 'Thiếu danh sách file hoặc nhóm mới' });
    }

    // Sanitize new group prefix (keep alpha-numeric, dash, dots)
    const sanitizedGroup = newGroup.replace(/[^\w\d\s\-\.]/g, '').replace(/\s+/g, '-');
    if (!sanitizedGroup) {
      return res.status(400).json({ message: 'Tên nhóm mới không hợp lệ' });
    }

    let movedCount = 0;
    const movedFiles: { oldName: string; newName: string; url: string }[] = [];

    for (const filename of filenames) {
      const oldPath = path.join(PRODUCTS_DIR, filename);
      if (!oldPath.startsWith(PRODUCTS_DIR) || !fs.existsSync(oldPath)) {
        continue;
      }

      const ext = path.extname(filename);
      
      // Determine a unique new filename with the new group prefix
      let finalName = `${sanitizedGroup}${ext}`;
      let counter = 1;
      
      while (
        fs.existsSync(path.join(PRODUCTS_DIR, finalName)) || 
        movedFiles.some(m => m.newName === finalName)
      ) {
        finalName = `${sanitizedGroup}-${counter}${ext}`;
        counter++;
      }

      const newPath = path.join(PRODUCTS_DIR, finalName);
      fs.renameSync(oldPath, newPath);
      
      // Sync rename to dist folder for production environment immediately
      renameFileInDist('products', filename, finalName);
      
      movedFiles.push({
        oldName: filename,
        newName: finalName,
        url: `/products/${finalName}`
      });
      movedCount++;
    }

    res.json({
      message: `Đã di chuyển thành công ${movedCount}/${filenames.length} file sang nhóm "${sanitizedGroup}"`,
      moved: movedFiles
    });
  } catch (error) {
    console.error('Media bulk move error:', error);
    res.status(500).json({ message: 'Lỗi di chuyển nhóm file' });
  }
});

// POST /api/media/upload-url — Download and upload image from external URL
router.post('/upload-url', async (req: any, res: any) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL không hợp lệ' });

    // Download image using axios
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Determine extension from content-type header
    let ext = '.jpg';
    const contentType = response.headers['content-type'];
    if (contentType) {
      if (contentType.includes('image/png')) ext = '.png';
      else if (contentType.includes('image/gif')) ext = '.gif';
      else if (contentType.includes('image/webp')) ext = '.webp';
      else if (contentType.includes('image/svg+xml')) ext = '.svg';
    }

    const uniqueName = `url-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(PRODUCTS_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);

    // Sync file to dist folder for production environment immediately
    syncFileToDist('products', uniqueName);

    res.json({
      message: 'Đã tải và lưu ảnh thành công',
      file: {
        filename: uniqueName,
        url: `/products/${uniqueName}`,
        type: 'image'
      }
    });
  } catch (error) {
    console.error('Upload URL error:', error);
    res.status(500).json({ message: 'Không thể tải ảnh từ URL này' });
  }
});

export default router;
