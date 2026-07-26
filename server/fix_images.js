/**
 * Fix product_images table to match actual files on disk.
 * 
 * Problem: DB stores paths like "/products/MCK5.0Đôi.png", "/products/MCK5.0Đôi.2.png"
 * Actual files are: "/products/MCK5.0Đôi-0.jpg", "/products/MCK5.0Đôi-1.jpg", etc.
 * 
 * This script:
 * 1. Reads all actual image files from public/products/
 * 2. Groups them by SKU prefix (e.g. MCK5.0Đôi)
 * 3. For each product, deletes old broken image records and inserts correct ones
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const PRODUCTS_DIR = path.resolve(__dirname, '../public/products');

// Extract SKU group from filename: "MCK5.0Đôi-0.jpg" → "MCK5.0Đôi"
function extractGroup(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const match = nameWithoutExt.match(/^(.+)-\d+$/);
  if (match) return match[1];
  return nameWithoutExt;
}

async function fixImages() {
  // 1. Read actual files
  const allFiles = fs.readdirSync(PRODUCTS_DIR)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .sort();
  
  // 2. Group by SKU
  const groups = {};
  for (const f of allFiles) {
    const group = extractGroup(f);
    if (!groups[group]) groups[group] = [];
    groups[group].push(f);
  }
  
  console.log(`Found ${allFiles.length} image files in ${Object.keys(groups).length} groups`);
  console.log('Groups:', Object.keys(groups).join(', '));
  
  // 3. Get all products
  const products = await prisma.products.findMany({
    select: { id: true, product_id: true, sku: true, name: true }
  });
  
  console.log(`\nFound ${products.length} products in DB\n`);
  
  let fixed = 0;
  let skipped = 0;
  
  for (const product of products) {
    const sku = product.sku || product.product_id;
    
    // Find matching file group
    const fileGroup = groups[sku];
    if (!fileGroup) {
      console.log(`⚠️  ${sku} (id:${product.id}): No matching files found on disk`);
      skipped++;
      continue;
    }
    
    // Get current images from DB
    const currentImages = await prisma.product_images.findMany({
      where: { product_id: product.product_id },
      orderBy: { sort_order: 'asc' }
    });
    
    // Check if images need fixing
    const currentPaths = currentImages.map(img => img.image_url);
    const correctPaths = fileGroup.map(f => `/products/${f}`);
    
    // Sort for comparison
    const currentSorted = [...currentPaths].sort();
    const correctSorted = [...correctPaths].sort();
    
    if (JSON.stringify(currentSorted) === JSON.stringify(correctSorted)) {
      console.log(`✅ ${sku} (id:${product.id}): Already correct (${currentImages.length} images)`);
      skipped++;
      continue;
    }
    
    // Delete old records
    await prisma.product_images.deleteMany({
      where: { product_id: product.product_id }
    });
    
    // Insert correct records
    await prisma.product_images.createMany({
      data: correctPaths.map((url, idx) => ({
        product_id: product.product_id,
        image_url: url,
        sort_order: idx
      }))
    });
    
    console.log(`🔄 ${sku} (id:${product.id}): Fixed ${currentImages.length} → ${correctPaths.length} images`);
    console.log(`   Old: ${currentPaths.slice(0, 3).join(', ')}${currentPaths.length > 3 ? '...' : ''}`);
    console.log(`   New: ${correctPaths.slice(0, 3).join(', ')}${correctPaths.length > 3 ? '...' : ''}`);
    fixed++;
  }
  
  console.log(`\n═══════════════════════════════════`);
  console.log(`Done! Fixed: ${fixed}, Skipped: ${skipped}, Total: ${products.length}`);
  
  await prisma.$disconnect();
}

fixImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
