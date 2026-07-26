import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🛠  Checking database settings for branding/logo overrides...');
  const settings = await prisma.settings.findFirst();
  if (settings) {
    console.log('Current settings:', settings);
    try {
      const branding = JSON.parse(settings.branding || '{}');
      if (branding.logoLight || branding.logoDark || branding.logoLightMobile || branding.logoDarkMobile) {
        console.log('Clearing custom database logo overrides to fall back to new GCnature assets...');
        branding.logoLight = '';
        branding.logoDark = '';
        branding.logoLightMobile = '';
        branding.logoDarkMobile = '';
        
        await prisma.settings.update({
          where: { id: settings.id },
          data: { branding: JSON.stringify(branding) },
        });
        console.log('✓ Database branding settings updated successfully!');
      } else {
        console.log('✓ Branding logo overrides are already empty. No update needed.');
      }
    } catch (e) {
      console.error('Failed to parse settings.branding:', e);
    }
  } else {
    console.log('No settings row found in database.');
  }
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error in cleanLogos script:', err);
  process.exit(1);
});
