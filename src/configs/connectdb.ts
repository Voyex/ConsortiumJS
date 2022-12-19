import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
// Enable the use of environment variables
dotenv.config();

if (
  !(
    process.env.DB_HOST &&
    process.env.DB_PORT &&
    process.env.DB_NAME &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    process.env.DB_CONN_LIMIT
  )
) {
  throw new Error('Could not Find DB Password');
}

let conn: mysql.Pool;
try {
  conn = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionLimit: parseInt(process.env.DB_CONN_LIMIT),
  });
} catch (error) {
  throw new Error('Could not Connect to Database');
}

export default conn;
