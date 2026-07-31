import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import orderRoutes from './routes/orders';
import productRoutes from './routes/products';
import articleRoutes from './routes/articles';
import reviewRoutes from './routes/reviews';
import bankRoutes from './routes/bank';
import contactRoutes from './routes/contact';
import settingsRoutes from './routes/settings';
import bannerRoutes from './routes/banners';
import mediaRoutes from './routes/media';
import { publicRouter as flashSalePublicRouter, adminRouter as flashSaleAdminRouter } from './routes/flashSale';
import tiktokRoutes from './routes/tiktok';
import voucherRoutes from './routes/vouchers';
import notificationRoutes from './routes/notifications';
import luckyWheelRoutes from './routes/luckyWheel';
import categoryRoutes from './routes/categories';
import { startAcbCronJob } from './cron/acbJob';
import { FRONTEND_URL, SERVER_PORT } from './config';

// Enable BigInt JSON serialization
(BigInt.prototype as any).toJSON = function () { return Number(this); };

const app = express();
app.set('trust proxy', 1);
const PORT = SERVER_PORT;

// ═══ Security Middleware ═══════════════════════════════════════════
// Helmet: Set secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet({
  contentSecurityPolicy: false,   // Let the SPA handle CSP via meta tags
  crossOriginEmbedderPolicy: false,
}));

// CORS: Only allow FRONTEND_URL or gcnature.com.vn domains
const allowedOrigins = [
  FRONTEND_URL,
  "https://gcnature.com.vn",
  "https://www.gcnature.com.vn",
  "http://localhost:8080",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Request Blocked by Security Policy'));
    }
  },
  credentials: true
}));

// Global rate limiter: 500 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu từ địa chỉ IP của bạn. Vui lòng thử lại sau.' },
}));

// Strict rate limiter for authentication (prevent brute-force password guessing & registration spam)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Thao tác quá nhiều lần. Vui lòng đợi 15 phút trước khi thử lại.' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/google', authLimiter);

// Limit JSON body size to 5mb (support bulk operations like spam cleanup)
app.use(express.json({ limit: '5mb' }));

// Custom API logger to trace admin saving actions and error codes
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API LOG] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Time: ${duration}ms`);
    if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
      console.log(`[API LOG BODY]`, JSON.stringify(req.body).substring(0, 500));
    }
  });
  next();
});

// Force browsers and Cloudflare CDN to bypass cache for dynamic API endpoints
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  next();
});

// Block access to sensitive files & directories
app.use((req, res, next) => {
  const blocked = /\.(env|git|gitignore|htaccess|user\.ini|ts|tsx|jsx|map)$/i;
  const blockedPaths = /^\/(\.env|\.git|server|node_modules|src\/|prisma)/i;
  if (blocked.test(req.path) || blockedPaths.test(req.path)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/flash-sale', flashSalePublicRouter);
app.use('/api/admin/flash-sale', flashSaleAdminRouter);
app.use('/api/tiktok', tiktokRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lucky-wheel', luckyWheelRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// In production, serve the React build from the project root /dist directory.
// server/src/index.ts -> server/src -> server -> project root -> dist
const clientDistPath = path.resolve(__dirname, '../../dist');
const publicPath = path.resolve(__dirname, '../../public');
app.use(express.static(clientDistPath));
app.use(express.static(publicPath)); // Serve uploaded banners from public/
app.use('/avatars', express.static(path.resolve(__dirname, '../../public/avatars'))); // Explicit avatars route
app.use('/api/avatars', express.static(path.resolve(__dirname, '../../public/avatars'))); // Serve via API path for production reverse proxy bypass

// Google Shopping Feed redirect helper
app.get('/google-feed.xml', (req, res) => {
  res.redirect('/api/products/google-feed');
});

// Google Shopping Promotions Feed redirect helper
app.get('/google-promotions.xml', (req, res) => {
  res.redirect('/api/products/google-promotions');
});

// React Router fallback for non-API routes such as /login, /shop, /admin.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startAcbCronJob();
});
