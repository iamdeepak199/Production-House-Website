const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate OTP function
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const otps = {}; // Object to store OTPs with user email as key

// POST route to handle OTP sending
router.post('/send-mail', (req, res) => {
    const { email } = req.body;

    // Generate OTP and store it
    const otp = generateOTP();
    otps[email] = otp;
    req.session.email = email;

    // Create a transporter object
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
    auth.sendMail(mailOptions, (error, emailResponse) => {
        if (error) {
            console.error('Error sending email to', email, ':', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('OTP sent successfully to', email);
            res.status(200).send('OTP sent successfully!');
        }
    });
});

// POST route to verify OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otps[email] == otp) {
        res.render('resetpassword'); // Assuming 'resetpassword' is the view for resetting the password
    } else {
        res.status(401).send('Invalid OTP!');
    }
});

module.exports = router;
