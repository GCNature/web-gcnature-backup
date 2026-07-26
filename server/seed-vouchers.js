const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

const vouchers = [
  { code: 'GIAM10K', name: 'Giam 10.000d', discount_amount: 10000n, min_order_value: 100000n },
  { code: 'GIAM20K', name: 'Giam 20.000d', discount_amount: 20000n, min_order_value: 200000n },
  { code: 'GIAM30K', name: 'Giam 30.000d', discount_amount: 30000n, min_order_value: 300000n },
  { code: 'GIAM40K', name: 'Giam 40.000d', discount_amount: 40000n, min_order_value: 400000n },
  { code: 'GIAM50K', name: 'Giam 50.000d', discount_amount: 50000n, min_order_value: 500000n },
];

async function seed() {
  for (const v of vouchers) {
    const r = await prisma.vouchers.upsert({
      where: { code: v.code },
      create: { ...v, expires_at: null, is_active: true },
      update: {},
    });
    console.log('Seeded:', r.code);
  }
  await prisma.$disconnect();
  console.log('Done!');
}

seed().catch(e => { console.error(e); process.exit(1); });
