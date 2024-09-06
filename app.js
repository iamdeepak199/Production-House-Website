const { db1, db2 } = require('./config/database'); // Use the correct file name here
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs"); // File system module
const qs = require("querystring"); // Parse query strings from the user's side
const http = require("http"); // Use HTTP to create a server
const nodemailer = require('nodemailer'); // Module to send emails
const bcrypt = require('bcrypt'); // Adds unique salt to each password for secure hashing
const chalk = require('chalk'); // Use for highlighting important console logs
const mysql = require('mysql2'); // Create connection with MySQL DB
const express = require('express'); // Include express modules within your project
const path = require('path'); // Provides utilities for working with file and directory paths
const session = require('express-session'); // Create session middleware
const crypto = require('crypto'); // Data encryption and decryption for security

// Generate random bytes for secure passwords (32 bytes, hex format)
const secret = crypto.randomBytes(32).toString('hex');

// Create an express app
const app = express();
const port = process.env.PORT || 3000; // Set the port

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('public'))); // Serve static files

// Load environment variables from .env files
require('dotenv').config();

// Set up the session middleware
app.use(session({
    secret: 'Name-Deepak-bhardwaj-vips', // Strong secret key
    resave: true, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
        maxAge: 60000, // Session expires after 1 minute (60000 ms)
    }
}));

// Set view engine to Handlebars (.hbs files)
app.set('view engine', 'hbs');

// <--------------------- Import all views here --------------------->
// GET route for the index page
app.get('/', (req, res) => {
    res.render('index');
});

// GET route for the login page
app.get('/login', (req, res) => {
    res.render('login');
});

// GET route for the register page
app.get('/register', (req, res) => {
    res.render('register');
});

// GET route for the forgot password page
app.get('/forgot', (req, res) => {
    res.render('forgot');
});

// GET route for the dashboard page
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// GET route for handling errors (404 page)
app.get('*', (req, res) => {
    res.status(404).render('error', { message: 'Page not found' });
});

// <--------------------- Import all routes here --------------------->
// Route to register
const registerRouter = require('./routes/register');
app.use('/', registerRouter);

// Route to login
const loginRouter = require('./routes/login');
app.use('/', loginRouter);

// Route for OTP verification
const otpRouter = require('./routes/otp');
app.use('/', otpRouter);

// Route to reset password
const resetPasswordRouter = require('./routes/resetpassword');
app.use('/', resetPasswordRouter);

// Route for dashboard
const dashboardRouter = require('./routes/dashboard');
app.use('/', dashboardRouter);

// Route for contact page
const contactRouter = require('./routes/contact');
app.use('/', contactRouter);

// App listening on specified port
app.listen(port, () => {
    console.log(chalk.green.bold.inverse(`Server is running at http://localhost:${port}`));
});
