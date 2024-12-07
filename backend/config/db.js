const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require('fs');


dotenv.config(); // Load environment variables from .env file

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectTimeout: 1000000 
});

module.exports = db;
