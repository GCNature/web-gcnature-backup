import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑  Deleting product "Kem Chống Nắng Dịu Nhẹ GC NATURE..." from database...');

  try {
    // 1. Find product by SKU or name
    const product = await prisma.products.findFirst({
      where: {
        OR: [
          { sku: 'KCN01' },
          { name: { contains: 'Kem Chống Nắng Dịu Nhẹ GC NATURE' } }
        ]
      }
    });

    if (!product) {
      console.log('ℹ  Product not found in the database. No deletion needed.');
      await prisma.$disconnect();
      return;
    }

    const productId = product.product_id;
    console.log(`Found product to delete: ${product.name} (SKU: ${product.sku}, ID: ${product.id}, ProductId: ${productId})`);

    // 2. Delete related images
    const deletedImages = await prisma.product_images.deleteMany({
      where: { product_id: productId }
    });
    console.log(`✓ Deleted ${deletedImages.count} related product images`);

    // 3. Delete related reviews
    const deletedReviews = await prisma.product_reviews.deleteMany({
      where: { product_id: productId }
    });
    console.log(`✓ Deleted ${deletedReviews.count} related product reviews`);

    // 4. Delete the product itself
    await prisma.products.delete({
      where: { id: product.id }
    });
    console.log('✓ Product deleted successfully from database');

  } catch (err) {
    console.error('Error during product deletion:', err);
  } finally {
    await prisma.$disconnect();
    console.log('🎉 Done.');
  }
}

main().catch((err) => {
  console.error('Failed to run deletion script:', err);
  process.exit(1);
});
