/**
 * One-shot script to create the flash_sale_campaigns and flash_sale_products
 * tables. Run with `npx tsx src/scripts/createFlashSaleTables.ts` from the
 * server folder. Safe to re-run — uses CREATE TABLE IF NOT EXISTS.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CREATE_CAMPAIGNS = `
CREATE TABLE IF NOT EXISTS flash_sale_campaigns (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_repeat_daily TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  banner_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_active (is_active),
  INDEX idx_start (start_at),
  INDEX idx_end (end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const CREATE_PRODUCTS = `
CREATE TABLE IF NOT EXISTS flash_sale_products (
  id INT NOT NULL AUTO_INCREMENT,
  campaign_id INT NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  sale_price BIGINT NOT NULL DEFAULT 0,
  discount_percent INT NOT NULL DEFAULT 0,
  stock_limit INT NOT NULL DEFAULT 0,
  sold_count INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_campaign_product (campaign_id, product_id),
  INDEX idx_campaign (campaign_id),
  INDEX idx_product (product_id),
  CONSTRAINT fs_campaign_fk FOREIGN KEY (campaign_id)
    REFERENCES flash_sale_campaigns (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function main() {
  await prisma.$executeRawUnsafe(CREATE_CAMPAIGNS);
  console.log('✓ flash_sale_campaigns ready');
  await prisma.$executeRawUnsafe(CREATE_PRODUCTS);
  console.log('✓ flash_sale_products ready');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
