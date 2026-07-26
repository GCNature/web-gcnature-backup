const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('New hash generated:', hashedPassword);

  const updatedUser = await prisma.users.update({
    where: { email: 'admin@mercytech.vn' },
    data: { password_hash: hashedPassword }
  });

  console.log('Successfully updated password for:', updatedUser.email);
  console.log('Current hash in DB:', updatedUser.password_hash);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
