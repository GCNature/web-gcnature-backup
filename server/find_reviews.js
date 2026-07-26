const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const reviews = await prisma.product_reviews.findMany({
      where: {
        OR: [
          { review_text: { contains: 'như cacc' } },
          { review_text: { contains: 'như cac' } },
          { reviewer_name: '123' }
        ]
      }
    });
    console.log("=== Found Reviews ===");
    console.log(JSON.stringify(reviews, null, 2));
    
    // Let's also look for reviews on product ID 3
    const product3Reviews = await prisma.product_reviews.findMany({
      where: {
        product_id: 'MCK5.0' // or whatever product_id is for ID 3
      }
    });
    console.log("=== Product 3 Reviews (first 5) ===");
    console.log(JSON.stringify(product3Reviews.slice(0, 5), null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
