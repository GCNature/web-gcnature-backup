import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'gcnatureshop2@gmail.com';
  const existingUser = await prisma.users.findFirst({
    where: { email }
  });
  console.log('Successfully queried user by email:', existingUser);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
