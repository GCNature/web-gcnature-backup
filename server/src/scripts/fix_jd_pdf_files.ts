import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const jdMap = [
  {
    originalFile: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH THƯƠNG MẠI ĐIỆN TỬ.pdf',
    asciiName: 'jd-ecom-intern.pdf',
    jobId: 'job-1'
  },
  {
    originalFile: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH SEO.pdf',
    asciiName: 'jd-seo-intern.pdf',
    jobId: 'job-2'
  },
  {
    originalFile: 'TUYỂN DỤNG_ THỰC TẬP SINH MARKETING.pdf',
    asciiName: 'jd-marketing-intern.pdf',
    jobId: 'job-3'
  },
  {
    originalFile: 'TUYỂN DỤNG_ THỰC TẬP SINH TRUYỀN THÔNG.pdf',
    asciiName: 'jd-media-intern.pdf',
    jobId: 'job-4'
  },
  {
    originalFile: 'TUYỂN DỤNG_ NHÂN VIÊN TRUYỀN THÔNG.pdf',
    asciiName: 'jd-media-official.pdf',
    jobId: 'job-5'
  },
  {
    originalFile: 'TUYỂN DỤNG_ THỰC TẬP SINH LIVESTREAM TIK TOK_SHOPEE.pdf',
    asciiName: 'jd-livestream-intern.pdf',
    jobId: 'job-6'
  },
  {
    originalFile: 'TUYỂN DỤNG_ LIVESTREAM TIK TOK_SHOPEE.pdf',
    asciiName: 'jd-livestream-official.pdf',
    jobId: 'job-7'
  },
  {
    originalFile: 'TUYỂN DỤNG_ THỰC TẬP SINH EDITOR.pdf',
    asciiName: 'jd-editor-intern.pdf',
    jobId: 'job-8'
  },
  {
    originalFile: 'Tuyển dụng nhân viên Editor.pdf',
    asciiName: 'jd-editor-official.pdf',
    jobId: 'job-9'
  }
];

async function fixFilesAndDb() {
  console.log('=== FIXING JD PDF FILENAMES AND DB LINKS ===');

  const srcDir = path.resolve(__dirname, '../../../Tuyển dụng');
  const pubDir = path.resolve(__dirname, '../../../public/uploads/jd');
  const distDir = path.resolve(__dirname, '../../../dist/uploads/jd');

  fs.mkdirSync(pubDir, { recursive: true });
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Copy & Rename all source PDFs to clean ASCII names
  for (const item of jdMap) {
    const srcPath = path.join(srcDir, item.originalFile);
    const pubPath = path.join(pubDir, item.asciiName);
    const distPath = path.join(distDir, item.asciiName);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, pubPath);
      fs.copyFileSync(srcPath, distPath);
      console.log(`Copied ${item.originalFile} -> ${item.asciiName}`);
    } else {
      console.log(`Source file not found: ${srcPath}`);
    }
  }

  // Also clean any Unicode files in pubDir & distDir by copying them to ASCII names
  if (fs.existsSync(pubDir)) {
    const pubFiles = fs.readdirSync(pubDir);
    for (const file of pubFiles) {
      if (file.endsWith('.pdf')) {
        const safeName = file
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-zA-Z0-9.-]/g, "_");
        
        if (safeName !== file) {
          fs.copyFileSync(path.join(pubDir, file), path.join(pubDir, safeName));
          fs.copyFileSync(path.join(pubDir, file), path.join(distDir, safeName));
          console.log(`Normalized ${file} -> ${safeName}`);
        }
      }
    }
  }

  // 2. Fetch page_recruitment setting from DB and update jdFileUrl to asciiName
  const setting = await prisma.settings.findUnique({ where: { key: 'page_recruitment' } });
  if (setting && setting.value) {
    try {
      const data = JSON.parse(setting.value);
      if (Array.isArray(data.tabsConfig)) {
        for (const job of data.tabsConfig) {
          const match = jdMap.find(m => m.jobId === job.id || job.jdFileUrl?.includes(encodeURIComponent(m.originalFile)) || job.jdFileName === m.originalFile);
          if (match) {
            job.jdFileUrl = `/uploads/jd/${match.asciiName}`;
            console.log(`Updated job ${job.id} (${job.title}) jdFileUrl -> /uploads/jd/${match.asciiName}`);
          } else if (job.jdFileUrl) {
            // Clean any Unicode characters in URL
            const filename = path.basename(job.jdFileUrl);
            const safeName = filename
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[đĐ]/g, "d")
              .replace(/[^a-zA-Z0-9.-]/g, "_");
            job.jdFileUrl = `/uploads/jd/${safeName}`;
          }
        }
      }

      data.updatedAt = new Date().toISOString();
      await prisma.settings.update({
        where: { key: 'page_recruitment' },
        data: { value: JSON.stringify(data) }
      });
      console.log('Successfully updated DB page_recruitment setting with ASCII PDF URLs!');
    } catch (e: any) {
      console.error('Error updating DB page_recruitment:', e);
    }
  }
}

fixFilesAndDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
