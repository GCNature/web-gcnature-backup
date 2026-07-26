const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readPolicy() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'page_agent_policy' }
    });
    if (setting) {
      console.log("Setting found in DB:");
      console.log(JSON.stringify(setting, null, 2));
    } else {
      console.log("No setting 'page_agent_policy' found in DB.");
    }
  } catch (error) {
    console.error("Error reading setting from DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

readPolicy();
