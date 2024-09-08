const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const chalk = require('chalk'); 

// Generate OTP function
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const otps = {}; // Object to store OTPs with user email as key

// POST route to send OTP
router.post('/send-mail', (req, res) => {
    const { email } = req.body;

    // Generate OTP and store it
    const otp = generateOTP();
    otps[email] = otp;
    req.session.email = email; // Store email in session

    // Create a transporter object for sending email
    const auth = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: 'productionhouse2201@gmail.com',
            pass: 'rxgq asts hpfq chws',
        },
    });

    const mailOptions = {
        from: 'productionhouse2201@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };

    // Send the email
    auth.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send(`
                <script>
                    alert('Error sending email!');                            
                    window.location.href = '/';                                 
                </script>
            `);      
        } else {
            console.log(chalk.bgGreenBright.bold.inverse('OTP sent successfully to', email));
            return res.status(200).send(`
                <script>
                    alert('OTP sent successfully!');                             
                    window.location.href = '/forgot';                               
                </script>
            `);      
        }
    });
});

// POST route to verify OTP
router.post('/verify-otp', (req, res) => {
    const { otp } = req.body; // No email field, use session email

    const email = req.session.email; // Get email from session

    // Verify OTP
    if (otps[email] == otp) {
        res.render('resetpassword'); // Assuming 'resetpassword' is the view for resetting the password
    } else {
        res.status(401).send(`
            <script>
                alert('Oops Invalid OTP!!');                             
                window.location.href = '/forgot';                                
            </script>
        `);      
    }
});


module.exports = router;
