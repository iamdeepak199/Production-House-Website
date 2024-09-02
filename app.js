const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");
const qs = require("querystring");
const http = require("http");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');        //use in secur_pass:   Adds a unique salt to each password to ensure that even if two users have the same password, their hashes will be different.
const chalk =require('chalk');           //use in heightlight something which important to identify clearly on consol.log
const mysql = require('mysql2');         //use to create connection with Mysql DB 
const express = require('express');      //use to include modules within your project :
const path = require('path');            //it provides utilities for working with file and directory paths. It helps in constructing, manipulating, and working with file and directory paths
const session = require('express-session'); //Create a session middleware  
const crypto = require('crypto');           //data encryption and decryption & used for security purpose like user authentication where storing the password in Database in the encrypted form
const secret = crypto.randomBytes(32).toString('hex');  //genrate random byets for password which is 32byts and includes hexa also :
const app = express();                   //creates an app object that has it's own methods such as app. get() and app. post() that allow you to register route handlers.
const port = process.env.PORT || 3000;   //it sets the PORT constant variable.
const saltRounds = 10;                   /*  $2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
                                              |  |  |                     |
                                              |  |  |                     hash-value = K0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
                                              |  |  |
                                              |  |  |
                                              |  |  salt = nOUIs5kJ7naTuTFkBy1veu
                                              |  |
                                              |  cost-factor = 10 = 2^10 iterations
                                              |
                                              hash-algorithm = 2b = BCrypt  
                                              1.wih "salt round" they actually mean the cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing the cost factor by 1 doubles the necessary time. The more time is necessary, the more difficult is brute-forcing.
                                              2.The salt is a random value, and should differ for each calculation, so the result should hardly ever be the same, even for equal passwords.*/

// Middleware setup
app.use(express.json());
app.use(express.static(path.join('public')));                  //express.static() is a function that takes a path, and returns function(request, response, next)a middleware that serves all files in
app.use(express.urlencoded({ extended: true }));


//to import the package which is passed as the param. Modules load from .env files
require('dotenv').config();                      
// Set up the session middleware
app.use(session({
    secret: 'Name-Deepak-bhardwaj-vips', //strong secret key
    resave: true, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      maxAge: 60000, // Session expires after 1 minute (60000 milliseconds)
    }
  }));
//Set view engine hbs bcoz i'm using .hbs files : other engines pug,ejs
app.set('view engine', 'hbs'); 
 

// MySQL Database connection which name is 'register' which takes :  username,email,password  file_name =>register.hbs
const db = mysql.createConnection({
    host: 'localhost',              //localhost
    user: 'root',                   //root
    password: '12345',              //My password on workbench 
    database: 'register'            // Database name 
});



// Connection to another database which name is 'usersquery' which takes : name,email,Message  file_name =>index.hbs (functinality==contact)
const db2 = mysql.createConnection({
    host: 'localhost',               //localhost
    user: 'root',                    //root
    password: '12345',               //password on workbench
    database: 'usersquery'           // Database name 
});



//Dtaabase connect : DB_Name : register
db.connect(err => {
    if (err) throw err;                                                                                              // if error occouerd throw error :
    console.log(chalk.blue.italic.inverse('Connected to MySQL database 1 Which is for users registeration.....'));   //else print :Connected to MySQL DB
});


//Dtaabase 2 connect : DB_Name : userquery Message 
db2.connect(err => {
    if (err) throw err;                                                                                              // if error occouerd throw error :
    console.log(chalk.blue.italic.inverse('Connected to MySQL database 2 Which is for users message or info...'));   //else print :Connected to MySQL DB
});

// GET route for handling my root page which is my index.hbs :
app.get('/', (req, res) => {                                          
    res.render('index');                                              //render root page which is index:
});


// GET route for handling my login.hbs page :
app.get('/login', (req, res) => {                                                   
    res.render('login');                            //render login page :
});


// GET route for handling my dashboard.hbs page :
app.get('dashboard', (req, res) => {
    // Assuming user data is available in req.user (like from a session or authentication middleware)
    if (req.user) {
        res.render('dashboard',{ user: req.users });                   
    } else {
        // Handle the case where there is no user data (e.g., redirect to login)
        res.redirect('/login');
    }
});


// GET route for handling my register.hbs page :
app.get('/register', (req, res) => {
    res.render('register');
});


// POST route for handling my register.hbs page :
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;                                     
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {                       //use bcrypt.hash to set password :
        if (err) {                                                                     // if Error occured:
            res.status(500).send('Error hashing password');
            return;
        }

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';   //otherwise insert Values to db:
        db.execute(query, [username, email, hashedPassword], (err, results) => {
            if (err) {                                                                      //if error ocuured:
                res.status(500).send('<h2>Sever side Error : Please try again later</h2>');
                return;
            }                                                                                   
            res.send('<h2>User registered successfully</h2>');                              //else return successful registered:            
        });
    });
});


// POST route for handling my login.hbs page :
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.execute(query, [username], (err, results) => {
        if (err) {                                                              //If Error :
            res.status(500).send('Database query error');                     
            return;
        }

        if (results.length > 0) {                                              //check results length > 0 otherwise return Invaild passwod:
            const user = results[0];                                           
            bcrypt.compare(password, user.password, (err, isMatch) => {        //use bcrypt.compare to password if match no issue otherwise Error
                if (err) {                                                      // if Eror occoured :
                    res.status(500).send('Error comparing passwords');
                    return;
                }

                if (isMatch) {                                                  //if info. match :
                    //console.log(user);                                       //if we want to show user data on console.log :
                    req.session.user = user;                                   //request for session 
                    res.redirect('/dashboard');                                //redirect my response to dashboard :
                } else {                                                       // info not match 
                    res.status(401).send('Invalid credentials');              
                }
            });
        } else {                                                                // info not match 
            res.status(401).send('Invalid credentials');
        }
    });
});

// route to dashboard :
const dashboardRouter = require('./routes/dashboard');
app.use('/', dashboardRouter);

// POST route for handling contact form submissions
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';

    db2.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving contact information:', err);
            return res.status(500).send('Server error, please try again later.');
        }
        res.send('Thank you for your message!');
    });
});


// GET route for handling my forgot.hbs page :
app.get('/forgot', (req, res) => {
    res.render('forgot');
});

// Catch-all route for undefined routes and errors :
app.get('*', (req, res) => {
    res.status(404).render('error', { message: 'Page not found' });
  });




/*---------------------------------------------------testiung------------------------------------------------>*/
const otps = {}; // Object to store OTPs with user email as key

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index.hbs file
app.get('/', (req, res) => {
    res.render('index');  // Renders the index.hbs file located in the views folder
});

// Route to handle OTP sending
app.post('/send-mail', (req, res) => {
    const { email } = req.body;

    // Generate OTP and store it
    const otp = generateOTP();
    otps[email] = otp;

    // Sending the email with OTP
    const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: 'productionhouse2201@gmail.com',
            pass: 'rxgq asts hpfq chws',
        }
    });

    const mailOptions = {
        from: "productionhouse2201@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    auth.sendMail(mailOptions, (error, emailResponse) => {
        if (error) {
            console.error('Error sending email to', email, ':', error);
            res.status(500).send('Error sending email');
        } else {
            console.log("OTP sent successfully to", email);
            res.status(200).send('OTP sent successfully!');
        }
    });
});

// Route to handle OTP verification
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    // Verify the OTP
    if (otps[email] && otps[email] == otp) {
        res.render('resetpassword');
    } else {
        res.status(401).send('Invalid OTP!');
    }
});




//app listening with fat arrow function which takes 2arguments : 
app.listen(port, () => {                                                                       
    console.log(chalk.green.bold.inverse(`Server is running at http://localhost:${port}`)); 
});
