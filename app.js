const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");                  //
const qs = require("querystring");        //querstring is a module to take string query from the user's side 
const http = require("http");            //use hhtp to create server :
const nodemailer = require('nodemailer');//nodemailer is a module to use to send mail 
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
            res.send(`                                                            //response send 
                <script>
                    alert('User registered successfully!');               //create alert box to send message 
                    window.location.href = '/';                                // Redirect to homepage or another page after alert while click OK 
                </script>
            `);                                      
        });
    });
});


// POST route for handling my login.hbs page :
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(400).send('No user found');
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Error comparing passwords');
            }

            if (isMatch) {
                // Passwords match, proceed with login
                res.send('Login successful');
            } else {
                // Passwords do not match
                res.status(400).send('Invalid credentials');
            }
        });
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
        res.send(`                                                   //response send 
            <script>
                alert('Thank you for your message!');               //create alert box to send message 
                window.location.href = '/';                         // Redirect to homepage or another page after alert while click OK 
            </script>
        `);
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
    const auth = nodemailer.createTransport({       //auth stands for authentication & create a object 
        service: "gmail",                           //use gmail service : Which type of service you use?
        secure: true,                               //provide security or not optional but recommeded ture 
        port: 465,                                  //gmail working on  port no : 465
        auth: {                                      // auth property 
            user: 'productionhouse2201@gmail.com',   //email name which is use to send otp 
            pass: 'rxgq asts hpfq chws',             //email password which is genrateded by App genrate by less secure password :
        }
    });

    const mailOptions = {
        from: "productionhouse2201@gmail.com",    //sender mail
        to: email,                                // to
        subject: "Your OTP Code",                 // subject in mail setion 
        text: ` your OTP code is: ${otp}. It will expire in 10 minutes.`, // message with six digit of code :
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
    if (otps[email] == otp) {        //check otp which is get on mail if it is equal to my mail then redirect to reset page :
    res.render('resetpassword');    // render my rest page 
    } else {
        res.status(401).send('Invalid OTP!'); // if wrong 
    }
});


/*------------------------------------------------------------------------testing for update pass --------------------------------->*/






app.post('/reset-password', (req, res) => {
    const { 'new-password': newPassword, 'confirm-password': confirmPassword } = req.body;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).send('Passwords do not match!');
    }

    // Get the user's email or ID (assuming you have stored it in the session or another way)
    const userEmail = req.session.email; // Example, assuming you stored the email in session

    // Hash the new password before storing it in the database
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error hashing the password.');
        }

        // Update the password in the MySQL database
        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(sql, [hashedPassword, userEmail], (err, result) => {
            if (err) {
                return res.status(500).send('Error updating the password in the database.');
            }
            res.send('Password reset successfully!');
        });
    });
});



//app listening with fat arrow function which takes 2arguments : 
app.listen(port, () => {                                                                       
    console.log(chalk.green.bold.inverse(`Server is running at http://localhost:${port}`)); 
});
