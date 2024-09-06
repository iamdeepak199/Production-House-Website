const express = require('express');  //import express
const router = new express.Router();     //import Router & creates a new instance of an Express Router object. 
const { db2 } = require('../config/database'); // Use the correct file name here


// POST route for handling contact form submissions
router.post('/contact', (req, res) => {
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

module.exports = router;   //export router 