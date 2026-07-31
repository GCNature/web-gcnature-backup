import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection('mysql://root:@localhost:3307/kinhmercy');
  
  try {
    await connection.query('ALTER TABLE users ADD COLUMN lucky_spins_count INT NOT NULL DEFAULT 1');
    console.log('Successfully added lucky_spins_count column to users table!');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column lucky_spins_count already exists.');
    } else {
      console.error('Error adding column:', err);
    }
  }

  // Double check columns
  const [cols] = await connection.query('DESCRIBE users');
  console.log('Updated USERS columns:', cols.map(c => c.Field));

  await connection.end();
}

main().catch(console.error);
