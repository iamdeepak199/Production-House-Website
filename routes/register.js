const { db } = require('../config/database');
const bcrypt = require('bcrypt');        //use in secur_pass:   Adds a unique salt to each password to ensure that even if two users have the same password, their hashes will be different.
const express = require('express');
const router = new express.Router(); 
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


// POST route for handling my register.hbs page :
router.post('/register', (req, res) => {
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

module.exports = router;   //export router 