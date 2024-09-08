const { db } = require('../config/database');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Ensure this is the same value used elsewhere

// POST route for password reset
router.post('/reset-password', (req, res) => {
    const { 'new-password': newPassword, 'confirm-password': confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return res.status(400).send(`                                                            
        <script>
            alert('Passwords do not match!');                
            window.location.href = '/resetpassword';                                
        </script>
    `);    

    const emails = req.session.email;
    if (!emails) return res.status(400).send(`                                                            
        <script>
            alert('User not found in session.');                
            window.location.href = '/register';                                
        </script>
    `);    

    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).send(`                                                            
            <script>
                alert('Error hashing the password!');               
                window.location.href = '/';                               
            </script>
        `);       

        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(sql, [hashedPassword, emails], (err) => {
            if (err) return res.status(500).send(`                                                            
                <script>
                    alert('Error updating the password in the database.');                
                    window.location.href = '/resetpassword';                                
                </script>
            `);    

            req.session.destroy();
            res.send(`                                                            
                <script>
                    alert('Password reset successfully!');                
                    window.location.href = '/login';                                
                </script>
            `);          
        });
    });
});

module.exports = router;
