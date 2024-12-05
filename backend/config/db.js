const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "myuser",
    password: "mypassword",
    database: "mydb",
});

module.exports = db;
