import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running migration: ADD is_repeat_daily TO flash_sale_campaigns');
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE flash_sale_campaigns ADD COLUMN is_repeat_daily TINYINT(1) NOT NULL DEFAULT 0;`
    );
    console.log('✓ Migration successful (column added)');
  } catch (err: any) {
    if (err.message && err.message.includes('Duplicate column name')) {
      console.log('✓ Column already exists, skipping.');
    } else {
      console.error('Migration failed:', err);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
