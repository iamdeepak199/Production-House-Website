const { db } = require('../config/database');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Ensure this is the same value used elsewhere

// POST route for password reset
router.post('/reset-password', (req, res) => {
    const { 'new-password': newPassword, 'confirm-password': confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return res.status(400).send('Passwords do not match!');

    const emails = req.session.email;
    if (!emails) return res.status(400).send('User not found in session.');

    bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing the password.');

        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(sql, [hashedPassword, emails], (err) => {
            if (err) return res.status(500).send('Error updating the password in the database.');

            req.session.destroy();
            res.send('Password reset successfully!');
        });
    });
});

module.exports = router;
