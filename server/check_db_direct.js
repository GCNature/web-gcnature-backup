import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:@localhost:3307/gcnature_db');
  
  const [banners] = await connection.query('SELECT * FROM banners');
  console.log('=== BANNERS IN DB ===');
  console.log(JSON.stringify(banners, null, 2));

  const [articles] = await connection.query("SELECT id, title, author, banner_url FROM articles WHERE title LIKE '%mercy%' OR content LIKE '%mercy%' OR author LIKE '%mercy%'");
  console.log('=== ARTICLES WITH MERCY ===');
  console.log(JSON.stringify(articles, null, 2));

  const [products] = await connection.query("SELECT id, name, brand FROM products WHERE brand LIKE '%mercy%' OR name LIKE '%mercy%'");
  console.log('=== PRODUCTS WITH MERCY ===');
  console.log(JSON.stringify(products, null, 2));

  await connection.end();
}

main().catch(console.error);
