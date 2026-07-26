import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Give admin user 1 spin
  const admin = await prisma.users.updateMany({
    where: { email: 'gcnatureofficial@gmail.com', lucky_spins_count: 0 },
    data: { lucky_spins_count: 1 }
  });
  console.log(`Updated ${admin.count} admin user(s) spin count to 1`);
  
  // Also check all users with 0 spins
  const zeroSpinUsers = await prisma.users.findMany({
    where: { lucky_spins_count: 0 },
    select: { id: true, email: true, lucky_spins_count: true }
  });
  console.log(`Users still with 0 spins: ${zeroSpinUsers.length}`);
  for (const u of zeroSpinUsers) {
    console.log(`  ID=${u.id} | ${u.email}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
