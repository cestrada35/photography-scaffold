import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

async function test() {
  console.log('Connecting with:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT), // Ensure port is a number
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
  console.log('Database connection successful! Result:', rows[0].solution);
  await connection.end();
}

test().catch(console.error);