require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getDB } = require('../models/conn');
let db, auth_db;
router.use(async (req, res, next) => {
    try {
        if (!auth_db) {
            auth_db = await getDB(process.env.AUTH_DB);
        }
        if (!db) {
            db = await getDB();
        }
        next();
    } catch (error) {
        console.error('Error switching DB:', err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/list', async (req, res) => {
    let data = await db.collection('vendors').find({}).toArray();
    res.status(200).send(data);
});
router.get('/dashboard', async (req, res) => {
    res.render('vendors/dashboard', ({ title: `${req.session.user.name} - Dashboard`, data: req.session.user }))
});


module.exports = router;