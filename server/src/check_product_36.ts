import { PrismaClient } from '@prisma/client';

(BigInt.prototype as any).toJSON = function () { return Number(this); };

const prisma = new PrismaClient();

async function main() {
  try {
    const product = await prisma.products.findUnique({
      where: { id: 36 }
    });
    console.log("Product 36 details in Database:");
    console.log(JSON.stringify(product, null, 2));

    if (product) {
      const images = await prisma.product_images.findMany({ where: { product_id: product.product_id } });
      console.log(`Images count: ${images.length}`);
      console.log(images.map(i => i.image_url));
    }

  } catch (error) {
    console.error("Error reading database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
