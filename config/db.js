const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        rejectUnauthorized: true
    }
});

console.log("database is connected")

module.exports = db;