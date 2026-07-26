const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readCatalog() {
  try {
    const record = await prisma.settings.findUnique({
      where: { key: 'page_catalog' }
    });
    console.log("PAGE_CATALOG_RECORD:", record ? record.value : "NOT_FOUND");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

readCatalog();
