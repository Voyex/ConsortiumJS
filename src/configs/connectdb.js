const mysql = require('mysql2/promise');

require('dotenv').config();


const conn = mysql.createPool(
    {
        host: 'donationmanagement.org',
        port: 3306,
        database: 'consortium',
        user: 'consortium',
        password: process.env.DB_PASS,
        connectionLimit: 10,
    }
);

module.exports = conn;