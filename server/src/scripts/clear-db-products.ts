import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑  Clearing all products, reviews, specs, variants, and images from database...');

  try {
    // 1. Delete all reviews
    const reviewsCount = await prisma.product_reviews.deleteMany({});
    console.log(`✓ Deleted ${reviewsCount.count} reviews`);

    // 2. Delete all images
    const imagesCount = await prisma.product_images.deleteMany({});
    console.log(`✓ Deleted ${imagesCount.count} images`);

    // 3. Delete all specs
    const specsCount = await prisma.product_specs.deleteMany({});
    console.log(`✓ Deleted ${specsCount.count} specs`);

    // 4. Delete all variants
    const variantsCount = await prisma.product_variants.deleteMany({});
    console.log(`✓ Deleted ${variantsCount.count} variants`);

    // 5. Delete all products
    const productsCount = await prisma.products.deleteMany({});
    console.log(`✓ Deleted ${productsCount.count} products`);

    console.log('🎉 Database products tables cleared successfully.');
  } catch (err) {
    console.error('Error clearing database products:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Failed to run clearing script:', err);
  process.exit(1);
});
