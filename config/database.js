const mysql = require('mysql2');
const chalk = require('chalk');

// Create connections to the databases
const db1 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'register'
});

const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'usersquery'
});

// Connect to the first database
db1.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database 1:', err);
        return;
    }
    console.log(chalk.blue.italic.inverse('Connected to MySQL database 1 for user registration...'));
});

// Connect to the second database
db2.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database 2:', err);
        return;
    }
    console.log(chalk.blue.italic.inverse('Connected to MySQL database 2 for user messages or info...'));
});

module.exports = { db1, db2 };
