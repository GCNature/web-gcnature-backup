/**
 * Seed sample flash-sale campaigns from existing products.
 *
 * Creates 4 ready-to-go campaigns:
 *   1. ĐANG DIỄN RA: Giờ vàng tối (started ~30 min ago, ends in ~2h)
 *   2. SẮP DIỄN RA: Săn deal khuya (starts in ~3h)
 *   3. SẮP DIỄN RA: Deal sáng mai 10H (starts tomorrow 10:00)
 *   4. SẮP DIỄN RA: Khung giờ chiều mai (starts tomorrow 14:00)
 *
 * Each campaign picks ~6 products from the catalog with realistic discounts.
 *
 * Usage (from /server):
 *     npx tsx src/scripts/seedFlashSale.ts
 *
 * Safe to re-run: deletes any campaign whose name starts with "[SEED]" then
 * recreates them so the times stay relative to "now".
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedSlot {
  name: string;
  description: string;
  bannerUrl: string;
  /** offset from now in minutes for start */
  startOffsetMin: number;
  /** offset from now in minutes for end */
  endOffsetMin: number;
  productCount: number;
  /** discount % range [min, max] */
  discountRange: [number, number];
  sortOrder: number;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Seeding flash sale campaigns...');

  // Load active products with their original price
  const products: any[] = await prisma.products.findMany({
    where: { is_active: true },
    select: {
      id: true,
      product_id: true,
      name: true,
      price: true,
      original_price: true,
    },
  });

  if (products.length === 0) {
    console.error('❌ No active products in DB. Aborting.');
    process.exit(1);
  }
  console.log(`Found ${products.length} active products`);

  // Wipe previous seeded campaigns (idempotent)
  const oldCampaigns = await prisma.flash_sale_campaigns.findMany({
    where: { name: { startsWith: '[SEED]' } },
    select: { id: true },
  });
  if (oldCampaigns.length > 0) {
    const ids = oldCampaigns.map((c: any) => c.id);
    await prisma.flash_sale_products.deleteMany({ where: { campaign_id: { in: ids } } });
    await prisma.flash_sale_campaigns.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${oldCampaigns.length} previous seed campaigns`);
  }

  const now = new Date();
  const seeds: SeedSlot[] = [
    {
      name: '[SEED] Giờ vàng tối — Giảm cực sốc',
      description: 'Khung giờ săn deal hot nhất, ưu đãi đến 30%. Số lượng có hạn!',
      bannerUrl: '/banners/promo-flash-sale.png',
      startOffsetMin: -30, // already started 30 min ago
      endOffsetMin: 120, // ends in 2 hours
      productCount: 6,
      discountRange: [20, 35],
      sortOrder: 0,
    },
    {
      name: '[SEED] Săn deal khuya 21H',
      description: 'Khung khuya: ưu đãi shock cho cú đêm.',
      bannerUrl: '/banners/promo-combo.png',
      startOffsetMin: 180, // starts in 3 hours
      endOffsetMin: 360, // ends in 6 hours
      productCount: 5,
      discountRange: [15, 28],
      sortOrder: 1,
    },
    {
      name: '[SEED] Deal vàng 10H sáng mai',
      description: 'Mở cổng săn lúc 10:00, deal hot từng phút.',
      bannerUrl: '/banners/promo-flash-sale.png',
      startOffsetMin: nextDayOffset(now, 10, 0),
      endOffsetMin: nextDayOffset(now, 12, 0),
      productCount: 6,
      discountRange: [18, 30],
      sortOrder: 2,
    },
    {
      name: '[SEED] Khung chiều 14H ngày mai',
      description: 'Buổi chiều thư giãn cùng deal kính thông minh.',
      bannerUrl: '/banners/promo-combo.png',
      startOffsetMin: nextDayOffset(now, 14, 0),
      endOffsetMin: nextDayOffset(now, 17, 0),
      productCount: 5,
      discountRange: [12, 22],
      sortOrder: 3,
    },
  ];

  for (const seed of seeds) {
    const start = new Date(now.getTime() + seed.startOffsetMin * 60_000);
    const end = new Date(now.getTime() + seed.endOffsetMin * 60_000);

    const picks = pickRandom(products, seed.productCount);
    const productRows = picks.map((p, idx) => {
      const orig = Number(p.original_price ?? p.price);
      const pct = rand(seed.discountRange[0], seed.discountRange[1]);
      const sale = Math.round(orig * (100 - pct)) / 100;
      return {
        product_id: p.product_id,
        sale_price: Math.round(sale),
        discount_percent: pct,
        stock_limit: rand(0, 1) === 0 ? 0 : rand(20, 100), // half unlimited, half capped
        sold_count: 0,
        sort_order: idx,
      };
    });

    const campaign = await prisma.flash_sale_campaigns.create({
      data: {
        name: seed.name,
        description: seed.description,
        start_at: start,
        end_at: end,
        is_active: true,
        sort_order: seed.sortOrder,
        banner_url: seed.bannerUrl,
      },
    });

    if (productRows.length > 0) {
      await prisma.flash_sale_products.createMany({
        data: productRows.map((r) => ({ ...r, campaign_id: campaign.id })),
      });
    }

    console.log(
      `✓ Created "${seed.name}" — ${productRows.length} products, ${start.toLocaleString('vi-VN')} → ${end.toLocaleString('vi-VN')}`
    );
  }

  console.log('✅ Seed complete!');
  await prisma.$disconnect();
}

/**
 * Return offset in minutes from `now` to next occurrence of HH:mm tomorrow.
 */
function nextDayOffset(now: Date, hour: number, minute: number): number {
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(hour, minute, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 60_000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
