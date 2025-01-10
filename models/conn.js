require('dotenv').config();
const { MongoClient } = require('mongodb');

const USER = `${process.env.DB_USER}`;
const PASS = `${process.env.DB_PASS}`;
const client = new MongoClient(`mongodb+srv://${USER}:${PASS}@cluster0.tukhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
let conn, db;
// Connect to MongoDB Atlas
async function connectToMongoDB(databaseName = 'vendor-management') {
    if (db && db.databaseName === databaseName) {
        return db;
    }
    try {
        if (!conn) {
            conn = await client.connect();
            console.log('DB Connected!');
        }
        db = conn.db(databaseName);
        return db;
    } catch (e) {
        console.error(e);
    }
}
connectToMongoDB() // Initialize the connection to MongoDB

module.exports = { getDB: connectToMongoDB };