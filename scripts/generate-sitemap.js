import fs from 'fs';
import path from 'path';

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://kinhthongminhmercy.vn').replace(/\/+$/, '');
const TODAY = new Date().toISOString().split('T')[0];

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/shop', priority: '0.9', changefreq: 'daily' },
  // Dedicated category pages (SEO sitelinks)
  { url: '/danh-muc/kinh-thong-minh-ai', priority: '0.85', changefreq: 'weekly' },
  { url: '/danh-muc/kinh-camera', priority: '0.85', changefreq: 'weekly' },
  { url: '/danh-muc/kinh-dich-thuat', priority: '0.85', changefreq: 'weekly' },
  { url: '/danh-muc/robot-ai', priority: '0.85', changefreq: 'weekly' },
  { url: '/danh-muc/phu-kien', priority: '0.85', changefreq: 'weekly' },
  // Other important pages
  { url: '/flash-sale', priority: '0.8', changefreq: 'daily' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/lien-he', priority: '0.6', changefreq: 'monthly' },
  { url: '/faq', priority: '0.5', changefreq: 'monthly' },
  { url: '/login', priority: '0.3', changefreq: 'monthly' },
  { url: '/register', priority: '0.3', changefreq: 'monthly' },
  // Policy pages
  { url: '/chinh-sach/bao-hanh', priority: '0.4', changefreq: 'monthly' },
  { url: '/chinh-sach/doi-tra', priority: '0.4', changefreq: 'monthly' },
  { url: '/chinh-sach/bao-mat', priority: '0.4', changefreq: 'monthly' },
  { url: '/chinh-sach/giao-hang', priority: '0.4', changefreq: 'monthly' },
];

// Read product IDs from products.ts
const productsFile = fs.readFileSync(path.resolve('src/data/products.ts'), 'utf-8');
const productIds = [...productsFile.matchAll(/^\s*id:\s*(\d+)/gm)].map(m => m[1]);

const productPages = productIds.map(id => ({
  url: `/product/${id}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

const allPages = [...staticPages, ...productPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemap);
console.log(`✅ Sitemap generated with ${allPages.length} URLs`);
