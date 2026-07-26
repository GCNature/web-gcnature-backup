/**
 * Public + admin Flash Sale routes.
 *
 * Public:
 *   GET  /api/flash-sale            -> all upcoming + active campaigns (sorted)
 *   GET  /api/flash-sale/active     -> currently running campaign(s) only
 *
 * Admin (mounted under /api/admin/flash-sale via admin.ts):
 *   GET    /admin/flash-sale                      -> list all campaigns w/ products
 *   GET    /admin/flash-sale/:id                  -> single campaign w/ products
 *   POST   /admin/flash-sale                      -> create campaign
 *   PUT    /admin/flash-sale/:id                  -> update campaign
 *   DELETE /admin/flash-sale/:id                  -> delete campaign
 *   PUT    /admin/flash-sale/:id/products         -> replace product list (bulk upsert)
 *   POST   /admin/flash-sale/:id/products         -> add a single product
 *   DELETE /admin/flash-sale/:id/products/:pid    -> remove a product from campaign
 */
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { isShopManager } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// ───────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────
function adjustCampaignDates(campaigns: any[], now: Date): any[] {
  return campaigns.map(c => {
    if (!c.is_repeat_daily) {
      return c;
    }

    const origStart = new Date(c.start_at);
    const origEnd = new Date(c.end_at);
    const durationMs = origEnd.getTime() - origStart.getTime();

    // Create virtual start today
    let startAt = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      origStart.getHours(),
      origStart.getMinutes(),
      origStart.getSeconds()
    );
    let endAt = new Date(startAt.getTime() + durationMs);

    // If today's slot has already ended, shift it to tomorrow!
    if (endAt < now) {
      startAt = new Date(startAt.getTime() + 24 * 60 * 60 * 1000);
      endAt = new Date(startAt.getTime() + durationMs);
    }

    return {
      ...c,
      start_at: startAt,
      end_at: endAt
    };
  });
}

function serializeCampaign(c: any, products: any[] = [], productMap?: Map<string, any>) {
  return {
    id: c.id,
    name: c.name,
    description: c.description || '',
    startAt: c.start_at,
    endAt: c.end_at,
    isActive: c.is_active,
    isRepeatDaily: c.is_repeat_daily,
    sortOrder: c.sort_order,
    bannerUrl: c.banner_url || '',
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    products: products.map((fp: any) => {
      const p = productMap?.get(fp.product_id);
      return {
        id: fp.id,
        productId: fp.product_id,
        salePrice: Number(fp.sale_price),
        discountPercent: fp.discount_percent,
        stockLimit: fp.stock_limit,
        soldCount: fp.sold_count,
        sortOrder: fp.sort_order,
        // Product snapshot (for the public Flash Sale UI)
        product: p
          ? {
              id: p.id,
              productId: p.product_id,
              sku: p.sku || p.product_id,
              name: p.name,
              shortName: p.short_name || '',
              category: p.category_name || '',
              originalPrice: Number(p.original_price),
              price: Number(p.price),
              image: p.image || '',
              stock: p.stock || 0,
            }
          : null,
      };
    }),
  };
}

async function attachProducts(campaigns: any[]) {
  if (campaigns.length === 0) return [];
  const ids = campaigns.map((c) => c.id);
  const fsProducts = await prisma.flash_sale_products.findMany({
    where: { campaign_id: { in: ids } },
    orderBy: [{ campaign_id: 'asc' }, { sort_order: 'asc' }],
  });
  const productIds = Array.from(new Set(fsProducts.map((fp) => fp.product_id)));
  const dbProducts = productIds.length
    ? await prisma.products.findMany({ where: { product_id: { in: productIds } } })
    : [];
  // Pull primary image for each product
  const images = productIds.length
    ? await prisma.product_images.findMany({
        where: { product_id: { in: productIds } },
        orderBy: { sort_order: 'asc' },
      })
    : [];
  const imageMap = new Map<string, string>();
  for (const img of images) {
    if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, img.image_url);
  }
  const productMap = new Map<string, any>();
  for (const p of dbProducts) {
    productMap.set(p.product_id, { ...p, image: imageMap.get(p.product_id) || '' });
  }

  const grouped = new Map<number, any[]>();
  for (const fp of fsProducts) {
    if (!grouped.has(fp.campaign_id)) grouped.set(fp.campaign_id, []);
    grouped.get(fp.campaign_id)!.push(fp);
  }

  return campaigns.map((c) =>
    serializeCampaign(c, grouped.get(c.id) || [], productMap)
  );
}

// ───────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ───────────────────────────────────────────────────────────
const publicRouter = express.Router();

// All visible campaigns (active flag) ordered by sort_order then start_at
publicRouter.get('/', async (_req, res) => {
  try {
    const now = new Date();
    // Show campaigns that are active AND (not yet ended OR repeat daily)
    const dbCampaigns = await prisma.flash_sale_campaigns.findMany({
      where: {
        is_active: true,
        OR: [
          { is_repeat_daily: true },
          { end_at: { gte: now } }
        ]
      },
      orderBy: [{ sort_order: 'asc' }, { start_at: 'asc' }],
    });
    const adjusted = adjustCampaignDates(dbCampaigns, now);
    adjusted.sort((a, b) => {
      const timeA = new Date(a.start_at).getTime();
      const timeB = new Date(b.start_at).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return a.sort_order - b.sort_order;
    });
    const result = await attachProducts(adjusted);
    res.json(result);
  } catch (err: any) {
    console.error('Public flash sale list error:', err);
    if (err?.code === 'P2021' || err?.message?.includes("doesn't exist") || err?.message?.includes("Can't reach database")) {
      // DB offline → build a synthetic campaign from fallbackProducts with discount >= 30%
      try {
        const { fallbackProducts } = await import('./fallbackProducts');
        const saleProducts = fallbackProducts.filter(
          (p) => p.discount >= 30 && p.stock > 0
        );
        if (saleProducts.length === 0) return res.json([]);

        const now = new Date();
        const endAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h from now

        const syntheticCampaign = {
          id: 1,
          name: 'Flash Sale Hôm Nay',
          description: 'Ưu đãi giảm giá từ 30% trở lên — số lượng có hạn!',
          startAt: now.toISOString(),
          endAt: endAt.toISOString(),
          isActive: true,
          sortOrder: 0,
          bannerUrl: '',
          products: saleProducts.map((p, idx) => ({
            id: idx + 1,
            productId: p.productId || p.sku,
            salePrice: p.price,
            discountPercent: p.discount,
            stockLimit: p.stock,
            soldCount: 0,
            sortOrder: idx,
            product: {
              id: p.id,
              productId: p.productId || p.sku,
              sku: p.sku,
              name: p.name,
              shortName: p.shortName || '',
              category: p.category,
              originalPrice: p.originalPrice,
              price: p.price,
              image: p.image || '',
              stock: p.stock,
            },
          })),
        };

        return res.json([syntheticCampaign]);
      } catch (fallbackErr) {
        console.error('Fallback flash sale error:', fallbackErr);
        return res.json([]);
      }
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});


// Currently running campaign(s)
publicRouter.get('/active', async (_req, res) => {
  try {
    const now = new Date();
    const dbCampaigns = await prisma.flash_sale_campaigns.findMany({
      where: {
        is_active: true,
        OR: [
          { is_repeat_daily: true },
          {
            start_at: { lte: now },
            end_at: { gte: now }
          }
        ]
      },
      orderBy: [{ sort_order: 'asc' }, { start_at: 'asc' }],
    });
    const adjusted = adjustCampaignDates(dbCampaigns, now);
    const activeCampaigns = adjusted.filter(
      (c) => new Date(c.start_at).getTime() <= now.getTime() && new Date(c.end_at).getTime() > now.getTime()
    );
    activeCampaigns.sort((a, b) => {
      const timeA = new Date(a.start_at).getTime();
      const timeB = new Date(b.start_at).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return a.sort_order - b.sort_order;
    });
    const result = await attachProducts(activeCampaigns);
    res.json(result);
  } catch (err: any) {
    console.error('Public flash sale active error:', err);
    if (err?.message?.includes("Can't reach database") || err?.code === 'P2021') {
      // DB offline → same fallback synthetic campaign
      try {
        const { fallbackProducts } = await import('./fallbackProducts');
        const saleProducts = fallbackProducts.filter((p) => p.discount >= 30 && p.stock > 0);
        if (saleProducts.length === 0) return res.json([]);
        const now = new Date();
        const endAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return res.json([{
          id: 1,
          name: 'Flash Sale Hôm Nay',
          description: 'Ưu đãi giảm giá từ 30% trở lên — số lượng có hạn!',
          startAt: now.toISOString(),
          endAt: endAt.toISOString(),
          isActive: true,
          sortOrder: 0,
          bannerUrl: '',
          products: saleProducts.map((p, idx) => ({
            id: idx + 1,
            productId: p.productId || p.sku,
            salePrice: p.price,
            discountPercent: p.discount,
            stockLimit: p.stock,
            soldCount: 0,
            sortOrder: idx,
            product: {
              id: p.id,
              productId: p.productId || p.sku,
              sku: p.sku,
              name: p.name,
              shortName: p.shortName || '',
              category: p.category,
              originalPrice: p.originalPrice,
              price: p.price,
              image: p.image || '',
              stock: p.stock,
            },
          })),
        }]);
      } catch {
        return res.json([]);
      }
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ───────────────────────────────────────────────────────────
// ADMIN ROUTES
// ───────────────────────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(isShopManager);

// List all campaigns (admin sees inactive too)
adminRouter.get('/', async (_req, res) => {
  try {
    const now = new Date();
    const campaigns = await prisma.flash_sale_campaigns.findMany({
      orderBy: [{ sort_order: 'asc' }, { start_at: 'asc' }],
    });
    const adjusted = adjustCampaignDates(campaigns, now);
    const result = await attachProducts(adjusted);
    res.json(result);
  } catch (err: any) {
    console.error('Admin flash sale list error:', err);
    // If table doesn't exist yet, return empty gracefully
    if (err?.code === 'P2021' || err?.message?.includes("doesn't exist")) {
      return res.json([]);
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Single campaign
adminRouter.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const campaign = await prisma.flash_sale_campaigns.findUnique({ where: { id } });
    if (!campaign) return res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
    const now = new Date();
    const adjusted = adjustCampaignDates([campaign], now);
    const [result] = await attachProducts(adjusted);
    res.json(result);
  } catch (err: any) {
    console.error('Admin flash sale get error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Create campaign (with optional initial products)
adminRouter.post('/', async (req, res) => {
  try {
    const { name, description, startAt, endAt, isActive, isRepeatDaily, sortOrder, bannerUrl, products } = req.body;
    if (!name || !startAt || !endAt) {
      return res.status(400).json({ message: 'Thiếu name / startAt / endAt' });
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Thời gian không hợp lệ' });
    }
    if (end.getTime() <= start.getTime()) {
      return res.status(400).json({ message: 'Thời gian kết thúc phải sau thời gian bắt đầu' });
    }

    const campaign = await prisma.flash_sale_campaigns.create({
      data: {
        name,
        description: description || null,
        start_at: start,
        end_at: end,
        is_active: isActive !== false,
        is_repeat_daily: !!isRepeatDaily,
        sort_order: Number(sortOrder) || 0,
        banner_url: bannerUrl || null,
      },
    });

    if (Array.isArray(products) && products.length) {
      await prisma.flash_sale_products.createMany({
        data: products.map((p: any, idx: number) => ({
          campaign_id: campaign.id,
          product_id: String(p.productId),
          sale_price: BigInt(p.salePrice || 0),
          discount_percent: Number(p.discountPercent || 0),
          stock_limit: Number(p.stockLimit || 0),
          sold_count: Number(p.soldCount || 0),
          sort_order: Number(p.sortOrder ?? idx),
        })),
        skipDuplicates: true,
      });
    }

    const [result] = await attachProducts([campaign]);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Admin flash sale create error:', err);
    res.status(500).json({ message: 'Lỗi tạo chiến dịch' });
  }
});

// Update campaign
adminRouter.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, startAt, endAt, isActive, isRepeatDaily, sortOrder, bannerUrl } = req.body;

    const data: any = { updated_at: new Date() };
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description || null;
    if (startAt !== undefined) {
      const d = new Date(startAt);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'startAt không hợp lệ' });
      data.start_at = d;
    }
    if (endAt !== undefined) {
      const d = new Date(endAt);
      if (isNaN(d.getTime())) return res.status(400).json({ message: 'endAt không hợp lệ' });
      data.end_at = d;
    }
    if (isActive !== undefined) data.is_active = !!isActive;
    if (isRepeatDaily !== undefined) data.is_repeat_daily = !!isRepeatDaily;
    if (sortOrder !== undefined) data.sort_order = Number(sortOrder) || 0;
    if (bannerUrl !== undefined) data.banner_url = bannerUrl || null;

    const campaign = await prisma.flash_sale_campaigns.update({
      where: { id },
      data,
    });

    if (campaign.end_at.getTime() <= campaign.start_at.getTime()) {
      return res.status(400).json({ message: 'Thời gian kết thúc phải sau thời gian bắt đầu' });
    }

    const [result] = await attachProducts([campaign]);
    res.json(result);
  } catch (err: any) {
    console.error('Admin flash sale update error:', err);
    res.status(500).json({ message: 'Lỗi cập nhật' });
  }
});

// Delete campaign
adminRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.flash_sale_products.deleteMany({ where: { campaign_id: id } });
    await prisma.flash_sale_campaigns.delete({ where: { id } });
    res.json({ message: 'Đã xóa' });
  } catch (err: any) {
    console.error('Admin flash sale delete error:', err);
    res.status(500).json({ message: 'Lỗi xóa' });
  }
});

// Replace entire product list of a campaign (bulk save)
adminRouter.put('/:id/products', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const list: Array<any> = Array.isArray(req.body?.products) ? req.body.products : [];

    const campaign = await prisma.flash_sale_campaigns.findUnique({ where: { id } });
    if (!campaign) return res.status(404).json({ message: 'Không tìm thấy chiến dịch' });

    // Filter out invalid product_ids and dedupe, keeping the first occurrence
    const seen = new Set<string>();
    const cleaned = list.filter((p) => {
      const pid = String(p.productId || '').trim();
      if (!pid || seen.has(pid)) return false;
      seen.add(pid);
      return true;
    });

    await prisma.$transaction([
      prisma.flash_sale_products.deleteMany({ where: { campaign_id: id } }),
      ...(cleaned.length
        ? [
            prisma.flash_sale_products.createMany({
              data: cleaned.map((p, idx) => ({
                campaign_id: id,
                product_id: String(p.productId),
                sale_price: BigInt(Math.max(0, Math.floor(Number(p.salePrice) || 0))),
                discount_percent: Math.max(0, Math.min(100, Number(p.discountPercent) || 0)),
                stock_limit: Math.max(0, Number(p.stockLimit) || 0),
                sold_count: Math.max(0, Number(p.soldCount) || 0),
                sort_order: Number(p.sortOrder ?? idx),
              })),
            }),
          ]
        : []),
    ]);

    const [result] = await attachProducts([campaign]);
    res.json(result);
  } catch (err: any) {
    console.error('Admin flash sale set products error:', err);
    res.status(500).json({ message: 'Lỗi cập nhật danh sách sản phẩm' });
  }
});

// Add a single product to a campaign
adminRouter.post('/:id/products', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { productId, salePrice, discountPercent, stockLimit, sortOrder } = req.body;
    if (!productId) return res.status(400).json({ message: 'Thiếu productId' });

    const campaign = await prisma.flash_sale_campaigns.findUnique({ where: { id } });
    if (!campaign) return res.status(404).json({ message: 'Không tìm thấy chiến dịch' });

    const created = await prisma.flash_sale_products.upsert({
      where: { campaign_id_product_id: { campaign_id: id, product_id: String(productId) } },
      update: {
        sale_price: BigInt(Math.max(0, Math.floor(Number(salePrice) || 0))),
        discount_percent: Math.max(0, Math.min(100, Number(discountPercent) || 0)),
        stock_limit: Math.max(0, Number(stockLimit) || 0),
        sort_order: Number(sortOrder) || 0,
      },
      create: {
        campaign_id: id,
        product_id: String(productId),
        sale_price: BigInt(Math.max(0, Math.floor(Number(salePrice) || 0))),
        discount_percent: Math.max(0, Math.min(100, Number(discountPercent) || 0)),
        stock_limit: Math.max(0, Number(stockLimit) || 0),
        sort_order: Number(sortOrder) || 0,
      },
    });

    res.json({ id: created.id, productId: created.product_id });
  } catch (err: any) {
    console.error('Admin flash sale add product error:', err);
    res.status(500).json({ message: 'Lỗi thêm sản phẩm' });
  }
});

// Remove a single product from a campaign
adminRouter.delete('/:id/products/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pid = String(req.params.pid);
    await prisma.flash_sale_products.deleteMany({
      where: { campaign_id: id, product_id: pid },
    });
    res.json({ message: 'Đã xóa' });
  } catch (err: any) {
    console.error('Admin flash sale remove product error:', err);
    res.status(500).json({ message: 'Lỗi xóa sản phẩm' });
  }
});

// Toggle is_active
adminRouter.patch('/:id/toggle', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const c = await prisma.flash_sale_campaigns.findUnique({ where: { id } });
    if (!c) return res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
    const updated = await prisma.flash_sale_campaigns.update({
      where: { id },
      data: { is_active: !c.is_active, updated_at: new Date() },
    });
    res.json({ id: updated.id, isActive: updated.is_active });
  } catch (err: any) {
    console.error('Admin flash sale toggle error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export { publicRouter, adminRouter };
export default publicRouter;
