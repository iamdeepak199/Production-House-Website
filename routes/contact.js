const { db } = require('../config/database');
const express = require('express');  //import express
const router = new express.Router();     //import Router & creates a new instance of an Express Router object. 


// POST route for handling contact form submissions
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';

    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving contact information:', err);
            return res.status(500).send(`                                                   
                <script>
                    alert('Server error, please try again later.');               
                    window.location.href = '/';                         
                </script>
            `);
        }
        res.send(`                                                   
            <script>
                alert('Thank you for your message!');               
                window.location.href = '/';                         
            </script>
        `);
    });
});

module.exports = router;   //export router 