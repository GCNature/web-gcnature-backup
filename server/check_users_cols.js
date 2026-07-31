import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection('mysql://root:@localhost:3307/kinhmercy');
  const [cols] = await connection.query('DESCRIBE users');
  console.log('=== USERS COLUMNS IN DB ===');
  console.log(cols.map(c => c.Field));
  await connection.end();
}

main().catch(console.error);
