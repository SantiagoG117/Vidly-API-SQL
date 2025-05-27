const mysql = require("mysql2");
require("dotenv");

//Build the database connection
const sqlConnection = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise(); //* Converts the MySQL connection into a promise-based interface, allowing us to use async/await for asyncronous calls

module.exports = sqlConnection;
