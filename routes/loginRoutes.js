require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getDB } = require('../models/conn');
let db;
router.use(async (req, res, next) => {
    try {
        if (!db || db.databaseName !== process.env.AUTH_DB) {
            db = await getDB(process.env.AUTH_DB); // Switch to the specified database
        }
        next();
    } catch (err) {
        console.error('Error switching DB:', err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/login', (req, res) => {
    if (!req.session.user) {
        res.render('login', { title: 'Login' })
    }
    else {
        res.redirect('/')
    }
});
// Login route to authenticate and set session
router.post('/login', async (req, res) => {
    const { user_type, username, password } = req.body;
    // Validate request body
    if (!user_type || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    let result = await db.collection(process.env.AUTH_COLLECTION).findOne({ type: user_type, username: username })
    if (result) {
        if (password === result.password) {
            req.session.user = {
                name: result.name,
                id: result._id,
                type: result.type
            }
            db = await getDB();
            return res.status(200).send({ message: 'Login successful' });
        } else {
            return res.status(400).json({ error: 'Invalid Username / Password' });
        }
    } else {
        return res.status(400).send({ error: 'Invalid Username / Password' })
    }
});


// Logout route to destroy session
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        // Respond with success if the session is destroyed
        res.status(200).send('User logged out!');
    });
});

module.exports = router;