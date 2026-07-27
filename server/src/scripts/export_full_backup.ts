import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function bigIntReplacer(_key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}

async function fullDump() {
  console.log('=== STARTING FULL DATABASE & ASSETS BACKUP ===');

  try {
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Mặt Nạ Skincare' WHERE id = 2`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Serum Dưỡng Phục Hồi' WHERE id = 3`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Kem Dưỡng Ẩm' WHERE id = 4`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Sữa Rửa Mặt & Tẩy Trang' WHERE id = 5`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Phụ Kiện Skincare' WHERE id = 6`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Mặt Nạ CICA' WHERE id = 7`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Mặt Nạ Hyaluronic' WHERE id = 8`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Mặt Nạ Vitamin C' WHERE id = 9`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Mặt Nạ Dưỡng Trắng' WHERE id = 10`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Serum Phục Hồi' WHERE id = 11`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Kem Dưỡng Da' WHERE id = 12`);
    await prisma.$executeRawUnsafe(`UPDATE categories SET name = 'Combo Mỹ Phẩm' WHERE id = 13`);
  } catch (e) {}
  
  const tableRows: any[] = await prisma.$queryRaw`SHOW TABLES`;
  const tableNames = tableRows.map(r => Object.values(r)[0] as string);

  const backupData: Record<string, any> = {};

  for (const tableName of tableNames) {
    try {
      const records: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM \`${tableName}\``);
      backupData[tableName] = records;
      console.log(`Fetched ${records.length} records from table '${tableName}'`);
    } catch (err: any) {
      console.log(`Table '${tableName}' skipped or error: ${err.message}`);
    }
  }

  const backupDir = path.resolve(__dirname, '../../../backup_data');
  fs.mkdirSync(backupDir, { recursive: true });

  fs.writeFileSync(
    path.join(backupDir, 'full_website_database_backup.json'),
    JSON.stringify(backupData, bigIntReplacer, 2),
    'utf8'
  );

  let sqlContent = '-- GC NATURE FULL DATABASE BACKUP DUMP\n';
  sqlContent += '-- Generated At: ' + new Date().toISOString() + '\n';
  sqlContent += 'SET NAMES utf8mb4;\n';
  sqlContent += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

  for (const [tableName, records] of Object.entries(backupData)) {
    if (!Array.isArray(records) || records.length === 0) continue;
    sqlContent += `-- TABLE: ${tableName}\n`;
    sqlContent += `DELETE FROM \`${tableName}\`;\n`;
    
    for (const record of records) {
      const keys = Object.keys(record);
      const values = keys.map(k => {
        const val = record[k];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'bigint') return val.toString();
        if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
        const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        return `'${str}'`;
      });
      sqlContent += `INSERT INTO \`${tableName}\` (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${values.join(', ')});\n`;
    }
    sqlContent += '\n';
  }

  sqlContent += 'SET FOREIGN_KEY_CHECKS = 1;\n';

  const rootSqlPath = path.resolve(__dirname, '../../../gcnature_full_backup.sql');
  const kinhmercySqlPath = path.resolve(__dirname, '../../../kinhmercy_backup.sql');
  const serverSqlPath = path.resolve(__dirname, '../../gcnature_full_backup.sql');

  fs.writeFileSync(rootSqlPath, sqlContent, 'utf8');
  fs.writeFileSync(kinhmercySqlPath, sqlContent, 'utf8');
  fs.writeFileSync(serverSqlPath, sqlContent, 'utf8');

  console.log('Successfully saved SQL dump to gcnature_full_backup.sql and kinhmercy_backup.sql!');

  const pubProducts = path.resolve(__dirname, '../../../public/products');
  const distProducts = path.resolve(__dirname, '../../../dist/products');
  const pubUploads = path.resolve(__dirname, '../../../public/uploads');
  const distUploads = path.resolve(__dirname, '../../../dist/uploads');

  fs.mkdirSync(pubProducts, { recursive: true });
  fs.mkdirSync(distProducts, { recursive: true });
  fs.mkdirSync(pubUploads, { recursive: true });
  fs.mkdirSync(distUploads, { recursive: true });

  const copyRecursive = (src: string, dest: string) => {
    if (!fs.existsSync(src)) return;
    const items = fs.readdirSync(src);
    for (const item of items) {
      const s = path.join(src, item);
      const d = path.join(dest, item);
      if (fs.statSync(s).isDirectory()) {
        fs.mkdirSync(d, { recursive: true });
        copyRecursive(s, d);
      } else {
        fs.copyFileSync(s, d);
      }
    }
  };

  copyRecursive(pubProducts, distProducts);
  copyRecursive(pubUploads, distUploads);
  console.log('Successfully synced all images and upload files to dist folder!');
}

fullDump()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
