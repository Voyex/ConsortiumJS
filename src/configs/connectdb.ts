import mysql from 'mysql2/promise';

import dotenv from 'dotenv';
dotenv.config();

const conn: mysql.Pool = mysql.createPool({
  host: 'donationmanagement.org',
  port: 3306,
  database: 'consortium',
  user: 'consortium',
  password: process.env.DB_PASS,
  connectionLimit: 10,
});

export default conn;
