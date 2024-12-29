const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/mongodb');

// POST route to insert data
router.post('/:module', moduleController.insertItem);

// GET route to fetch all documents
router.get('/:module', moduleController.getAllItems);

// GET route to fetch a single document by ID
router.get('/:module/:id', moduleController.getItemById);

// PUT route to update a document by ID
router.put('/:module/:id', moduleController.updateItemById);

// DELETE route to delete a document by ID
router.delete('/:module/:id', moduleController.deleteItemById);

module.exports = router;
