require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getDB } = require('../models/conn');
const { getNextSequenceValue, rollbackSequenceIncrement } = require('../controllers/counterController');
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
    try {
        const collection = db.collection('contracts');
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
})
router.get('/add', async (req, res) => {
    if (req.session.user) {
        let type = req.session.user.type !== 'user' ? 'Add' : 'Make Request';
        res.render('contracts/add_contract', { title: 'Add Contract', type: type, data: req.session.user })
    }
});
router.post('/add', async (req, res) => {

    try {
        const collection = db.collection('contracts');
        const newItem = req.body;

        // Generate the next ID for the vendor
        const sequenceValue = await getNextSequenceValue('contracts', db);
        const newId = `CONTRACT_${sequenceValue}`;
        newItem._id = newId;

        // Insert the new contract into the collection
        const result = await collection.insertOne(newItem);

        // insert into user collections
        if (result) {
            res.status(201).json({ message: 'Contract Created successfully', id: result.insertedId });
        }
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({ error: 'Failed to create contract' });
        rollbackSequenceIncrement('contracts', db)
    }
})

module.exports = router;