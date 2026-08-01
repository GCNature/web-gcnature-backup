const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.payment_methods.findMany();
  console.log('--- PAYMENT METHODS ROWS IN DB ---');
  console.log(JSON.stringify(rows, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
