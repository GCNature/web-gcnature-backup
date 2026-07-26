/**
 * Fix MCK 6.0 cover image - swap sort_order so MCK6.0-10.jpg (glasses+dock) becomes the cover
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get all MCK6.0 images
  const images = await prisma.product_images.findMany({
    where: { product_id: 'MCK6.0' },
    orderBy: { sort_order: 'asc' }
  });

  console.log('Current MCK6.0 images:');
  images.forEach(img => {
    console.log(`  sort_order=${img.sort_order}: ${img.image_url}`);
  });

  // Find the image MCK6.0-10.jpg (glasses with dock - best cover)
  const targetImg = images.find(img => img.image_url.includes('MCK6.0-10.jpg'));
  const coverImg = images.find(img => img.sort_order === 0);

  if (!targetImg || !coverImg) {
    console.log('Target or cover image not found!');
    return;
  }

  console.log(`\nSwapping: "${coverImg.image_url}" (sort 0) <-> "${targetImg.image_url}" (sort ${targetImg.sort_order})`);

  // Swap sort_order
  const oldSort = targetImg.sort_order;
  await prisma.product_images.update({
    where: { id: targetImg.id },
    data: { sort_order: 0 }
  });
  await prisma.product_images.update({
    where: { id: coverImg.id },
    data: { sort_order: oldSort }
  });

  console.log('✅ Cover image updated! MCK6.0-10.jpg is now the cover.');
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
