const express = require('express');
const router = express.Router();
const { getDB } = require('../models/conn');
let db;
router.use(async (req, res, next) => {
    try {
        if (!db || db.databaseName !== 'vendor-management') {
            db = await getDB();
            next();
        }
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