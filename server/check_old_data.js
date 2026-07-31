import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banners.findMany();
  console.log('=== BANNERS ===');
  console.dir(banners, { depth: null });

  const articles = await prisma.articles.findMany({
    where: {
      OR: [
        { title: { contains: 'mercy' } },
        { content: { contains: 'mercy' } },
        { author: { contains: 'mercy' } }
      ]
    }
  });
  console.log('=== MERCY ARTICLES ===', articles.length);

  const productsWithMercyBrand = await prisma.products.findMany({
    where: {
      OR: [
        { brand: { contains: 'mercy' } },
        { name: { contains: 'mercy' } }
      ]
    }
  });
  console.log('=== MERCY PRODUCTS ===', productsWithMercyBrand.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
