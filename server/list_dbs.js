import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection('mysql://root:@localhost:3307/');
  const [dbs] = await connection.query('SHOW DATABASES');
  console.log('=== DATABASES ON MYSQL 3307 ===');
  console.log(dbs);
  await connection.end();
}

main().catch(console.error);
