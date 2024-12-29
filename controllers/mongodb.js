const { getDB } = require('../models/conn.js');
const { ObjectId } = require('mongodb');

// Initialize a persistent DB instance
let dbInstance = null;
const getDBInstance = async () => {
    if (!dbInstance) {
        dbInstance = await getDB();
    }
    return dbInstance;
};

exports.insertItem = async (req, res) => {
    try {
        const db = await getDBInstance();
        const module = req.params.module;
        const collection = db.collection(module);
        const newItem = req.body;

        if (newItem._id) {
            newItem._id = new ObjectId(newItem._id);
        }

        const result = await collection.insertOne(newItem);
        res.status(201).json({ message: `${module} inserted successfully`, id: result.insertedId });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error inserting data');
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const db = await getDBInstance();
        const module = req.params.module;
        const collection = db.collection(module);

        const data = await collection.find({}).toArray();
        res.status(200).json(data);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error fetching data');
    }
};

exports.getItemById = async (req, res) => {
    try {
        const db = await getDBInstance();
        const module = req.params.module;
        const id = req.params.id;
        const collection = db.collection(module);

        const data = await collection.findOne({ _id: new ObjectId(id) });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).send('Document not found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error fetching data');
    }
};

exports.updateItemById = async (req, res) => {
    try {
        const db = await getDBInstance();
        const module = req.params.module;
        const id = req.params.id;
        const updatedData = req.body;
        const collection = db.collection(module);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: `${module} updated successfully` });
        } else {
            res.status(404).send('Document not found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating data');
    }
};

exports.deleteItemById = async (req, res) => {
    try {
        const db = await getDBInstance();
        const module = req.params.module;
        const id = req.params.id;
        const collection = db.collection(module);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: `${module} deleted successfully` });
        } else {
            res.status(404).send('Document not found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error deleting data');
    }
};
