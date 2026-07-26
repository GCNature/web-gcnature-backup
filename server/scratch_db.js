const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function test() {
  const products = await prisma.products.findMany({
    select: { id: true, product_id: true, sku: true, name: true, category_name: true }
  });
  console.log("Products in DB:", products);
  await prisma.$disconnect();
}
test();
