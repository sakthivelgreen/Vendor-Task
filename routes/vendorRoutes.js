require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getDB } = require('../models/conn');
let db, auth_db;
const upload = multer();
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

router.get('/ratings', async (req, res) => {
    if (req.session.user.type !== 'vendor') {
        res.render('vendors/ratings', { title: "Rate Vendor", data: req.session.user })
    } else res.redirect('/')
})
router.post('/ratings', upload.none(), async (req, res) => {
    const new_item = req.body;
    try {
        const query = { _id: new_item._id };
        const update = { $set: new_item };
        const options = { upsert: true };

        let result = await db.collection('ratings').updateOne(query, update, options);

        if (result.upsertedId) {
            res.status(200).send('Ratings added!');
        } else if (result.matchedCount > 0) {
            res.status(200).send('Ratings updated!');
        } else {
            res.status(200).send('No changes made.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Could not add or update ratings');
    }

})

router.post('/category-add', async (req, res) => {
    let new_item = req.body;
    try {
        let result = await db.collection('categories').insertOne(new_item);
        if (result) {
            res.status(200).send('Category Added Successfully')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Error Creating Category')
    }

})

module.exports = router;