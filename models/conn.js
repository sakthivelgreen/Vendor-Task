require('dotenv').config();
const { MongoClient } = require('mongodb');

const USER = process.env.DB_USER;
const PASS = encodeURIComponent(process.env.DB_PASS);
const con_string = `mongodb+srv://${USER}:${PASS}@cluster0.tukhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(con_string, {
    monitorCommands: process.env.NODE_ENV === 'production', // To log commands (use only for debugging; disable in production)
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    connectTimeoutMS: 10000,        // Connection timeout in milliseconds
    socketTimeoutMS: 45000,         // Socket timeout
    maxPoolSize: 10,                // Maximum number of connections in the connection pool
    minPoolSize: 1,                 // Minimum number of connections in the pool
    retryWrites: true,              // Enables retryable writes (MongoDB Atlas default)
    appName: 'Vendor Management System',
});
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