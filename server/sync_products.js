/**
 * Sync Products Script
 * - Adds MCK6.0 if missing
 * - Fixes categories for all 23 SKUs
 * - Updates product_images for all 23 SKUs
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// ═══════════════════════════════════════
// SKU → Category mapping (from user's table)
// ═══════════════════════════════════════
const SKU_CATEGORY = {
  'MCK6.0': 'Kính Thông Minh AI',
  'MCK5.0Đôi': 'Kính Thông Minh AI',
  'MCK5.0T': 'Kính Thông Minh AI',
  'MCK5.0D': 'Kính Thông Minh AI',
  'MCK5.1Đôi': 'Kính Thông Minh AI',
  'MCK5.1T': 'Kính Thông Minh AI',
  'MCK5.1D': 'Kính Thông Minh AI',
  'KDT5.0Đôi': 'Kính Dịch Thuật',
  'KDT5.0T': 'Kính Dịch Thuật',
  'KDT5.0D': 'Kính Dịch Thuật',
  'KDT5.1Đôi': 'Kính Dịch Thuật',
  'KDT5.1T': 'Kính Dịch Thuật',
  'KDT5.1D': 'Kính Dịch Thuật',
  'POV5.0Đôi': 'Kính Có Camera',
  'POV5.0T': 'Kính Có Camera',
  'POV5.0D': 'Kính Có Camera',
  'POV5.1Đôi': 'Kính Có Camera',
  'POV5.1T': 'Kính Có Camera',
  'POV5.1D': 'Kính Có Camera',
  'RBnu-capy': 'Robot AI',
  'RBnu-gautruc': 'Robot AI',
  'RBnu-Tho': 'Robot AI',
  'BD1': 'Phụ Kiện',
};

// ═══════════════════════════════════════
// MCK 6.0 product data (from Google Sheet)
// ═══════════════════════════════════════
const MCK6_DATA = {
  product_id: 'MCK6.0',
  sku: 'MCK6.0',
  name: 'Kính Thông Minh Bluetooth Mercy MCK 6.0 Có Dock Sạc Camera Quay Chụp, Trợ lý AI, Dịch Thuật',
  short_name: 'Mercy MCK 6.0 Dock Sạc',
  category_name: 'Kính Thông Minh AI',
  price: BigInt(4891800),
  original_price: BigInt(5990000),
  discount: 18,
  badge: 'Mới',
  rating: 5.0,
  sold: 0,
  stock: 100,
  brand: 'Mercy Tech Global',
  description: `Kính Thông Minh Bluetooth Mercy MCK 6.0 Có Dock sạc - Camera Quay Video/Chụp Hình - Trợ Lý AI - Dịch Thuật - Nghe Gọi - Chống Nước IP65

Mercy MCK 6.0 – Kính Thông Minh Bluetooth Mercy là bước tiến mới trong dòng thiết bị đeo công nghệ.

Sản phẩm kết hợp giữa thời trang – sức khỏe – tiện ích thông minh, mang đến trải nghiệm hoàn toàn khác biệt cho người dùng hiện đại.

Không chỉ là một chiếc kính mắt thông thường, Mercy MCK 6.0 còn là tai nghe không dây, camera quay video, trợ lý AI cá nhân, thiết bị ghi âm và dịch thuật realtime với độ trễ chỉ 0,5s nhanh nhất thị trường.

1️⃣Trợ lý AI kết nối APP (Hỗ trợ Full Tiếng Việt)
- Với AI Q&A và công nghệ xử lý ngôn ngữ tự nhiên, Mercy MCK 6.0 có thể nhanh chóng trả lời mọi câu hỏi.

2️⃣Nghe nhạc – Gọi điện đàm thoại cực rõ
- Âm thanh định hướng 3D giúp truyền âm thanh trực tiếp đến tai.
- Micro kép khử ồn AI giúp đàm thoại rõ ràng.

3️⃣Quay phim 2K, chụp ảnh Full HD.
- Trang bị camera 32MP, hỗ trợ quay video 2K chống rung EIS góc nhìn thứ nhất.

4️⃣Dịch thuật tức thì
- Kính thông minh Mercy MCK 6.0 hỗ trợ dịch Realtime song song nhiều ngôn ngữ.

5️⃣Có Dock sạc siêu tiện thay thế pin dự phòng. Duy trì pin đến 7 ngày.

6️⃣Độ bền cao – Hoạt động mọi môi trường
- Vật liệu ABS chống trầy xước, chịu va đập.
- Chuẩn IP65 chống nước – chống bụi – chống mồ hôi.

7️⃣Pin khỏe – Sạc nhanh
- Dung lượng 270mAh, nghe nhạc liên tục đến 12 giờ.`,
  seo_tags: 'kính thông minh,kính thông minh mercy,mercy,smart glasses,kính có camera,kính bluetooth,kính nghe nhạc,MCK 6.0,dock sạc',
  shopee_url: 'https://s.shopee.vn/6Ah9vSRXSn',
  tiktok_url: 'https://www.tiktok.com/view/product/1733225043704055552',
  is_flash_sale: false,
  flash_sale_percent: 0,
  is_active: true,
  features_vn: `🔥 CÁC TÍNH NĂNG CỦA KÍNH MERCY 
1. Trợ lý AI cá nhân Mercy (điều khiển bằng giọng nói).
2. Dịch thuật REALTIME đa ngôn ngữ.
3. Nghe nhạc chất lượng cao với loa âm thanh 3D định hướng.
4. Gọi điện rảnh tay với Micro kép khử ồn AI, cho âm thanh trong trẻo.
5. Quay video 2K với góc nhìn thứ nhất (First Person View).
6. Chụp ảnh với Camera 32MP chống rung.
7. Ghi âm 1 chạm.
8. Nhận dạng hình ảnh AI thông minh (nhận diện vật thể, dịch văn bản).
9. Pin trâu 270mAh, sử dụng liên tục 6–12 giờ.
10. Chống nước đạt chuẩn IP65.
11. Thay tròng kính linh hoạt như màu, kính cận,...`,
  features_en: `🔥 FEATURES OF MERCY GLASSES
1. Mercy personal AI assistant (voice control).
2. REALTIME multi-language translation.
3. High-quality music playback with directional 3D speakers.
4. Hands-free calling with AI-powered dual noise-canceling microphones.
5. 2K video recording with first-person view.
6. 32MP camera with image stabilization.
7. One-touch audio recording.
8. Intelligent AI image recognition.
9. Long-lasting 270mAh battery, 6–12 hours of continuous use.
10. IP65 waterproof rating.
11. Flexible lens options.`,
  footer_info: `Xin chân thành cảm ơn❤️
© Bản quyền nội dung video thuộc về Mercy
☞ Vui lòng không Reup!
🔥MERCY – Smart Vision, Smart Life🔥
Hotline: 0898273899
Liên hệ hợp tác: 0398684921 (Mr.Manh)`,
  production_year: 2025,
  warranty_data: 'Bảo hành mặc định: 15 ngày | BH 3 Tháng: +550k | BH 6 Tháng: +650k | BH 12 Tháng: +900k',
};

async function main() {
  console.log('🚀 Starting product sync...\n');

  // ═══ PHASE 1: Add MCK 6.0 if missing ═══
  console.log('📦 Phase 1: Checking MCK 6.0...');
  let mck6 = await prisma.products.findFirst({ where: { product_id: 'MCK6.0' } });
  if (!mck6) {
    console.log('  ➕ MCK 6.0 not found, creating...');
    mck6 = await prisma.products.create({ data: MCK6_DATA });
    console.log(`  ✅ Created MCK 6.0 (id: ${mck6.id})`);
    
    // Also add specs for MCK 6.0
    const specs = [
      { product_id: 'MCK6.0', spec_name: 'Camera', spec_value: '32MP chống rung EIS', sort_order: 1 },
      { product_id: 'MCK6.0', spec_name: 'Video', spec_value: '2K POV (lên đến 12 phút)', sort_order: 2 },
      { product_id: 'MCK6.0', spec_name: 'Pin kính', spec_value: '270mAh', sort_order: 3 },
      { product_id: 'MCK6.0', spec_name: 'Dock sạc', spec_value: 'Dung lượng lớn, duy trì 7 ngày', sort_order: 4 },
      { product_id: 'MCK6.0', spec_name: 'Thời lượng', spec_value: '6–12 giờ liên tục', sort_order: 5 },
      { product_id: 'MCK6.0', spec_name: 'Chống nước', spec_value: 'IP65', sort_order: 6 },
      { product_id: 'MCK6.0', spec_name: 'Loa', spec_value: '3D định hướng', sort_order: 7 },
      { product_id: 'MCK6.0', spec_name: 'Micro', spec_value: 'Kép khử ồn AI', sort_order: 8 },
      { product_id: 'MCK6.0', spec_name: 'Trọng lượng', spec_value: '35g', sort_order: 9 },
      { product_id: 'MCK6.0', spec_name: 'Chất liệu', spec_value: 'ABS chống trầy xước', sort_order: 10 },
      { product_id: 'MCK6.0', spec_name: 'Thương hiệu', spec_value: 'Mercy', sort_order: 11 },
    ];
    await prisma.product_specs.createMany({ data: specs });
    console.log('  ✅ Added specs for MCK 6.0');
  } else {
    console.log(`  ✔️ MCK 6.0 already exists (id: ${mck6.id})`);
  }

  // ═══ PHASE 2: Fix categories for all 23 SKUs ═══
  console.log('\n📁 Phase 2: Fixing categories...');
  const allProducts = await prisma.products.findMany({
    select: { id: true, product_id: true, sku: true, category_name: true }
  });

  let catUpdated = 0;
  let catSkipped = 0;
  for (const p of allProducts) {
    const sku = p.sku || p.product_id;
    const correctCategory = SKU_CATEGORY[sku];
    if (!correctCategory) {
      console.log(`  ⚠️ ${sku} — not in mapping, skipping`);
      continue;
    }
    if (p.category_name === correctCategory) {
      catSkipped++;
      continue;
    }
    await prisma.products.update({
      where: { id: p.id },
      data: { category_name: correctCategory }
    });
    console.log(`  🔄 ${sku}: "${p.category_name}" → "${correctCategory}"`);
    catUpdated++;
  }
  console.log(`  ✅ Categories: ${catUpdated} updated, ${catSkipped} already correct`);

  // ═══ PHASE 3: Update product_images for all 23 SKUs ═══
  console.log('\n🖼️ Phase 3: Syncing product images...');
  const publicDir = path.join(__dirname, '..', 'public', 'products');
  
  // Scan all files in public/products/
  let allFiles = [];
  try {
    allFiles = fs.readdirSync(publicDir);
  } catch (e) {
    console.error('  ❌ Cannot read public/products/ directory');
    return;
  }

  const skuList = Object.keys(SKU_CATEGORY);
  let imgUpdated = 0;

  for (const sku of skuList) {
    // Find matching files for this SKU
    // Files are named like: MCK5.0D-0.jpg, MCK5.0D-1.jpg, MCK6.0-video.mp4, etc.
    const skuFiles = allFiles
      .filter(f => {
        // Match exactly: starts with SKU followed by - (to avoid MCK5.0D matching MCK5.0Đôi)
        const baseName = f.split('.')[0]; // Remove extension first might not work for multi-dot
        return f.startsWith(sku + '-');
      })
      .sort((a, b) => {
        // Sort: images first (by number), then videos
        const aIsVideo = a.endsWith('.mp4');
        const bIsVideo = b.endsWith('.mp4');
        if (aIsVideo && !bIsVideo) return 1;
        if (!aIsVideo && bIsVideo) return -1;
        // Extract number for sorting
        const aNum = parseInt(a.replace(sku + '-', '')) || 999;
        const bNum = parseInt(b.replace(sku + '-', '')) || 999;
        return aNum - bNum;
      });

    if (skuFiles.length === 0) {
      console.log(`  ⚠️ ${sku} — no images found in public/products/`);
      continue;
    }

    // Check if product exists in DB
    const product = await prisma.products.findFirst({
      where: { OR: [{ product_id: sku }, { sku: sku }] }
    });
    if (!product) {
      console.log(`  ⚠️ ${sku} — not in database, skipping images`);
      continue;
    }

    // Delete existing images for this product
    await prisma.product_images.deleteMany({
      where: { product_id: product.product_id }
    });

    // Insert new images
    const imageRecords = skuFiles.map((file, index) => ({
      product_id: product.product_id,
      image_url: `/products/${file}`,
      sort_order: index,
    }));

    await prisma.product_images.createMany({ data: imageRecords });
    console.log(`  ✅ ${sku} — ${imageRecords.length} images synced (${skuFiles.filter(f => f.endsWith('.mp4')).length} videos)`);
    imgUpdated++;
  }

  console.log(`\n✅ Image sync complete: ${imgUpdated} products updated`);

  // ═══ PHASE 4: Summary ═══
  console.log('\n═══════════════════════════════════════');
  console.log('📊 SYNC SUMMARY');
  console.log('═══════════════════════════════════════');
  
  const finalProducts = await prisma.products.findMany({
    where: { is_active: true },
    select: { product_id: true, category_name: true }
  });
  
  const categoryCounts = {};
  for (const p of finalProducts) {
    const cat = p.category_name || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  
  console.log('\nCategories:');
  for (const [cat, count] of Object.entries(categoryCounts)) {
    console.log(`  ${cat}: ${count} products`);
  }
  console.log(`\nTotal: ${finalProducts.length} active products`);

  // Check images
  const imgCounts = await prisma.product_images.groupBy({
    by: ['product_id'],
    _count: { id: true }
  });
  
  const noImages = finalProducts.filter(p => !imgCounts.find(ic => ic.product_id === p.product_id));
  if (noImages.length > 0) {
    console.log('\n⚠️ Products without images:');
    for (const p of noImages) {
      console.log(`  - ${p.product_id}`);
    }
  } else {
    console.log('\n✅ All products have images!');
  }
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
