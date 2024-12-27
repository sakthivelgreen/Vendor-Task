require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.Mongo_URI;
const client = new MongoClient(uri);
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