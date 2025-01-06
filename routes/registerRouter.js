const express = require('express');
const router = express.Router();
const { getNextSequenceValue, rollbackSequenceIncrement } = require('../controllers/counterController');
const { getDB } = require('../models/conn');
// Register Page - vendor
router.get('/vendor', (req, res) => {
    if (!req.session.user) {
        res.render('vendors/add_vendor', { title: 'Register - Vendor Management System', msg: 'Register' })
    } else if (req.session.user.type === 'admin') {
        res.render('vendors/add_vendor', { title: 'Add Vendor', msg: 'Add Vendor' })
    } else {
        res.render('error', { title: 'Registration Error', message: 'You are a registered user!' });
    }
});

// Store Vendor
router.post('/vendor', async (req, res) => {
    const mongo = await getDB(process.env.AUTH_DB);
    const collection_users = mongo.collection(process.env.AUTH_COLLECTION)
    try {
        const db = await getDB(); // Get the database instance
        const collection = db.collection('vendors');
        const newItem = req.body;
        const userObj = {
            'username': newItem.username,
            'password': newItem.password,
            'name': newItem.vendorName,
            'type': 'vendor'
        }
        delete newItem.username;
        delete newItem.password;

        // Generate the next ID for the vendor
        const sequenceValue = await getNextSequenceValue('vendors', db);
        const newId = `vendor_${sequenceValue}`;
        newItem._id = newId;
        userObj._id = newId;

        // Insert the new vendor into the collection
        const result = await collection.insertOne(newItem);

        // insert into user collections
        const result_1 = await collection_users.insertOne(userObj);
        if (result && result_1) {
            res.status(201).json({ message: 'Vendor inserted successfully', id: result_1.insertedId });
        }
    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).json({ error: 'Failed to create vendor' });
        rollbackSequenceIncrement('vendors', mongo)
    }
})

// Register page - user
router.get('/user', (req, res) => {
    if (!req.session.user) {
        res.render('users/add_user', { title: 'Register - Vendor Management System', msg: 'Register' })
    } else if (req.session.user.type === 'admin') {
        res.render('users/add_user', { title: 'Add User', msg: 'Add User' })
    } else {
        res.render('error', { title: 'Registration Error', message: 'You are a registered user!' });
    }
});

// store user
router.post('/user', async (req, res) => {
    const mongo = await getDB(process.env.AUTH_DB);
    const collection_users = mongo.collection(process.env.AUTH_COLLECTION)
    try {
        const db = await getDB(); // Get the database instance
        const collection = db.collection('users');
        const newItem = req.body;
        const userObj = {
            'username': newItem.username,
            'password': newItem.password,
            'name': newItem.name,
            'type': 'user'
        }
        delete newItem.username;
        delete newItem.password;

        // Generate the next ID for the users
        const sequenceValue = await getNextSequenceValue('users', db);
        const newId = `user_${sequenceValue}`;
        newItem._id = newId;
        userObj._id = newId;

        // Insert the new vendor into the collection
        const result = await collection.insertOne(newItem);

        // insert into user collections
        const result_1 = await collection_users.insertOne(userObj);
        if (result && result_1) {
            res.status(201).json({ message: 'user inserted successfully', id: result_1.insertedId });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
        rollbackSequenceIncrement('users', mongo)
    }
})
module.exports = router;