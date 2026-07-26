/**
 * Script: Cập nhật category_name cho sản phẩm qua Admin API
 * Chạy: node fix_categories_api.js
 * 
 * Cần đăng nhập admin trước để lấy token, hoặc set biến TOKEN
 */

const API_BASE = 'https://kinhthongminhmercy.vn/api';

// SKU → Category mapping theo spreadsheet
const skuCategoryMap = {
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

// Prefix fallback
function getCategoryByPrefix(sku) {
  if (sku.startsWith('MCK')) return 'Kính Thông Minh AI';
  if (sku.startsWith('KDT')) return 'Kính Dịch Thuật';
  if (sku.startsWith('POV')) return 'Kính Có Camera';
  if (sku.startsWith('RB')) return 'Robot AI';
  if (sku.startsWith('BD')) return 'Phụ Kiện';
  return null;
}

async function main() {
  // Get admin token - you need to set this
  const TOKEN = process.env.TOKEN || '';
  
  if (!TOKEN) {
    console.log('❌ Cần set biến TOKEN. Ví dụ:');
    console.log('   set TOKEN=your_admin_jwt_token');
    console.log('   node fix_categories_api.js');
    console.log('\nĐể lấy token: Đăng nhập admin panel, mở DevTools > Application > Local Storage > token');
    process.exit(1);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  };

  // 1. Fetch all products
  console.log('🔍 Đang lấy danh sách sản phẩm...');
  const res = await fetch(`${API_BASE}/admin/products`, { headers });
  if (!res.ok) {
    console.log('❌ Lỗi lấy sản phẩm:', res.status, await res.text());
    process.exit(1);
  }
  
  const products = await res.json();
  console.log(`📦 Tổng: ${products.length} sản phẩm\n`);

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    const sku = p.sku || '';
    const correctCategory = skuCategoryMap[sku] || getCategoryByPrefix(sku);

    if (!correctCategory) {
      console.log(`⚠️  SKU "${sku}" (id:${p.id}) - không nhận diện được, giữ nguyên: "${p.category}"`);
      continue;
    }

    if (p.category === correctCategory) {
      skipped++;
      continue;
    }

    console.log(`🔄 ${sku} (id:${p.id}): "${p.category}" → "${correctCategory}"`);

    // Update via admin API
    const updateRes = await fetch(`${API_BASE}/admin/products/${p.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ categoryName: correctCategory })
    });

    if (updateRes.ok) {
      updated++;
    } else {
      console.log(`   ❌ Lỗi cập nhật: ${updateRes.status}`);
    }

    // Small delay to not overwhelm the server
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n═══════════════════════════');
  console.log(`✅ Đã cập nhật: ${updated} sản phẩm`);
  console.log(`⏩ Đã đúng (skip): ${skipped} sản phẩm`);
  console.log('═══════════════════════════');
}

main().catch(e => { console.error('❌ Lỗi:', e); process.exit(1); });
