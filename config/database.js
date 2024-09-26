const mysql = require('mysql2');
const chalk = require('chalk');

// Create a single connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'users_data'                                    // Combined database
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the MySQL database:', err);
        return;
    }
    console.log(chalk.blue.italic.inverse('Connected to MySQL database for user registration and info...'));
});

module.exports = { db };
