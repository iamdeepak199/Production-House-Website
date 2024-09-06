const express = require('express');  //import express
const router = new express.Router();     //import Router & creates a new instance of an Express Router object. 
const bcrypt = require('bcrypt');        //use in secur_pass:   Adds a unique salt to each password to ensure that even if two users have the same password, their hashes will be different.

const { db1 } = require('../config/database'); // Use the correct file name here

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db1.execute(query, [username], (err, results) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    res.status(500).send('Error comparing passwords');
                    return;
                }

                if (isMatch) {
                    //console.log(user);
                    req.session.user = user;
                    res.redirect('/dashboard');
                } else {
                    res.status(401).send('Invalid credentials');
                }
            });
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});
module.exports = router;   //export router 