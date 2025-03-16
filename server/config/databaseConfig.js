const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// configurations for creating MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// executing connection
connection.connect(function(err) {
    if (err) {
        console.log("Error occurred while connecting: ", err);
    } else {
        console.log("Connection created with MySQL successfully");
    }
});

/**
 * Helper function: Execute MySQL query (Promise-based)
 * @param {*} sql 
 * @param {*} values 
 * @returns 
 */
const query = (sql, values) =>
    new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });

module.exports = {connection, query};
