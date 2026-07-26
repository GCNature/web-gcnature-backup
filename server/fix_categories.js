/**
 * Script: Cập nhật category_name cho tất cả sản phẩm theo đúng phân loại
 * 
 * Bảng phân loại:
 *   Kính Thông Minh AI: MCK6.0, MCK5.0Đôi, MCK5.0T, MCK5.0D, MCK5.1Đôi, MCK5.1T, MCK5.1D
 *   Kính Dịch Thuật:   KDT5.0Đôi, KDT5.0T, KDT5.0D, KDT5.1Đôi, KDT5.1T, KDT5.1D
 *   Kính Có Camera:    POV5.0Đôi, POV5.0T, POV5.0D, POV5.1Đôi, POV5.1T, POV5.1D
 *   Robot AI:          RBnu-capy, RBnu-gautruc, RBnu-Tho
 *   Phụ Kiện:          BD1
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// SKU → Category mapping
const skuCategoryMap = {
  // Kính Thông Minh AI
  'MCK6.0': 'Kính Thông Minh AI',
  'MCK5.0Đôi': 'Kính Thông Minh AI',
  'MCK5.0T': 'Kính Thông Minh AI',
  'MCK5.0D': 'Kính Thông Minh AI',
  'MCK5.1Đôi': 'Kính Thông Minh AI',
  'MCK5.1T': 'Kính Thông Minh AI',
  'MCK5.1D': 'Kính Thông Minh AI',

  // Kính Dịch Thuật
  'KDT5.0Đôi': 'Kính Dịch Thuật',
  'KDT5.0T': 'Kính Dịch Thuật',
  'KDT5.0D': 'Kính Dịch Thuật',
  'KDT5.1Đôi': 'Kính Dịch Thuật',
  'KDT5.1T': 'Kính Dịch Thuật',
  'KDT5.1D': 'Kính Dịch Thuật',

  // Kính Có Camera
  'POV5.0Đôi': 'Kính Có Camera',
  'POV5.0T': 'Kính Có Camera',
  'POV5.0D': 'Kính Có Camera',
  'POV5.1Đôi': 'Kính Có Camera',
  'POV5.1T': 'Kính Có Camera',
  'POV5.1D': 'Kính Có Camera',

  // Robot AI
  'RBnu-capy': 'Robot AI',
  'RBnu-gautruc': 'Robot AI',
  'RBnu-Tho': 'Robot AI',

  // Phụ Kiện
  'BD1': 'Phụ Kiện',
};

async function main() {
  console.log('🔍 Đang kiểm tra sản phẩm trong DB...\n');

  // Lấy tất cả sản phẩm
  const products = await prisma.products.findMany({
    select: { id: true, product_id: true, sku: true, name: true, category_name: true }
  });

  console.log(`📦 Tổng số sản phẩm: ${products.length}\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const p of products) {
    const sku = p.sku || p.product_id;
    const correctCategory = skuCategoryMap[sku];

    if (!correctCategory) {
      // Try matching by prefix
      let matched = null;
      if (sku.startsWith('MCK')) matched = 'Kính Thông Minh AI';
      else if (sku.startsWith('KDT')) matched = 'Kính Dịch Thuật';
      else if (sku.startsWith('POV')) matched = 'Kính Có Camera';
      else if (sku.startsWith('RB')) matched = 'Robot AI';
      else if (sku.startsWith('BD')) matched = 'Phụ Kiện';

      if (matched) {
        if (p.category_name !== matched) {
          console.log(`🔄 [PREFIX] ${sku} (id:${p.id}): "${p.category_name}" → "${matched}"`);
          await prisma.products.update({
            where: { id: p.id },
            data: { category_name: matched }
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        console.log(`⚠️  SKU "${sku}" (id:${p.id}) không có trong bảng phân loại - giữ nguyên: "${p.category_name}"`);
        notFound++;
      }
      continue;
    }

    if (p.category_name === correctCategory) {
      skipped++;
      continue;
    }

    console.log(`🔄 ${sku} (id:${p.id}): "${p.category_name}" → "${correctCategory}"`);

    await prisma.products.update({
      where: { id: p.id },
      data: { category_name: correctCategory }
    });
    updated++;
  }

  console.log('\n═══════════════════════════');
  console.log(`✅ Đã cập nhật: ${updated} sản phẩm`);
  console.log(`⏩ Đã đúng (skip): ${skipped} sản phẩm`);
  console.log(`⚠️  Không tìm thấy SKU: ${notFound} sản phẩm`);
  console.log('═══════════════════════════\n');

  // Verify: show final state
  const final = await prisma.products.findMany({
    select: { sku: true, product_id: true, category_name: true, name: true },
    orderBy: { id: 'asc' }
  });

  console.log('📋 Trạng thái cuối cùng:');
  const catGroups = {};
  for (const p of final) {
    const cat = p.category_name || '(trống)';
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(p.sku || p.product_id);
  }

  for (const [cat, skus] of Object.entries(catGroups)) {
    console.log(`\n  📁 ${cat} (${skus.length} sp):`);
    for (const s of skus) {
      console.log(`     - ${s}`);
    }
  }
}

main()
  .catch(e => { console.error('❌ Lỗi:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
