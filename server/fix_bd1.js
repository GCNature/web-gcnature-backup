const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixBD1() {
  const prod = await prisma.products.findFirst({ where: { product_id: 'BD1' } });
  if (!prod) { console.log('BD1 not found'); return; }
  
  await prisma.product_images.deleteMany({ where: { product_id: 'BD1' } });
  
  const imgs = [];
  for (let i = 0; i < 8; i++) {
    imgs.push({ product_id: 'BD1', image_url: `/products/BD1-${i}.jpg`, sort_order: i });
  }
  await prisma.product_images.createMany({ data: imgs });
  console.log('✅ BD1: 8 images synced');
  await prisma.$disconnect();
}

fixBD1().catch(e => { console.error(e); process.exit(1); });
