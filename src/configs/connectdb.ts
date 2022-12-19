import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
// Enable the use of environment variables
dotenv.config();

if (!process.env.DB_PASS) {
  throw new Error('Could not Find DB Password');
}

let conn: mysql.Pool;
try {
  conn = mysql.createPool({
    host: 'donationmanagement.org',
    port: 3306,
    database: 'consortium',
    user: 'consortium',
    password: process.env.DB_PASS,
    connectionLimit: 10,
  });
} catch (error) {
  throw new Error('Could not Connect to Database');
}

export default conn;
