import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection('mysql://root:@localhost:3307/kinhmercy');
  const [tables] = await connection.query('SHOW TABLES');
  console.log('=== TABLES IN KINHMERCY ===');
  console.log(tables);

  const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
  console.log('Products count:', products[0].count);

  const [users] = await connection.query('SELECT id, name, email, role FROM users LIMIT 10');
  console.log('Users:', users);

  await connection.end();
}

main().catch(console.error);
