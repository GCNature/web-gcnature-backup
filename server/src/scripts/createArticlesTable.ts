/**
 * One-shot migration: create the `articles` table.
 *
 * The frontend ships a NewsSection / NewsDetail page and the backend has
 * routes/articles.ts already, but the underlying table never existed in the
 * production database. This script provisions it idempotently.
 *
 * Usage (from /server):
 *     npx tsx src/scripts/createArticlesTable.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS articles (
  id INT NOT NULL AUTO_INCREMENT,
  slug VARCHAR(160) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NULL,
  content MEDIUMTEXT NULL,
  image VARCHAR(500) NULL,
  date VARCHAR(20) NULL,
  category VARCHAR(80) NULL DEFAULT 'Tin Tức',
  author VARCHAR(120) NULL DEFAULT 'Mercy',
  views INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_slug (slug),
  INDEX idx_published (is_published),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function main() {
  console.log('🛠  Creating articles table if missing...');
  await prisma.$executeRawUnsafe(CREATE_SQL);
  console.log('✓ articles table ready');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
