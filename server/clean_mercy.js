import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection('mysql://root:@localhost:3307/kinhmercy');
  const [tables] = await connection.query('SHOW TABLES');
  console.log('=== TABLES IN KINHMERCY ===');
  console.log(tables);

  // Check columns of products table
  const [productCols] = await connection.query('DESCRIBE products');
  console.log('=== PRODUCT COLUMNS ===');
  console.log(productCols.map(c => c.Field));

  // Check products brand = 'Mercy' or brand containing 'Mercy'
  const [mercyProducts] = await connection.query("SELECT id, name, brand FROM products WHERE brand LIKE '%mercy%' OR name LIKE '%mercy%'");
  console.log('=== MERCY PRODUCTS ===');
  console.log(mercyProducts);

  // Update products brand if 'Mercy Tech Global' or 'Mercy'
  const [updateResult] = await connection.query("UPDATE products SET brand = 'GCnature' WHERE brand LIKE '%mercy%' OR brand IS NULL OR brand = ''");
  console.log('Updated products brand result:', updateResult);

  // Check articles containing 'Mercy'
  try {
    const [articles] = await connection.query("SELECT id, title FROM articles WHERE title LIKE '%mercy%' OR content LIKE '%mercy%' OR author LIKE '%mercy%'");
    console.log('=== ARTICLES WITH MERCY ===');
    console.log(articles);

    const [updateArticles] = await connection.query("UPDATE articles SET author = 'GCnature' WHERE author LIKE '%mercy%' OR author IS NULL");
    console.log('Updated articles author result:', updateArticles);
  } catch (e) {
    console.log('Articles table error:', e.message);
  }

  await connection.end();
}

main().catch(console.error);
