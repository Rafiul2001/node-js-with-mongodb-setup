const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.URI;
const dbName = process.env.DBNAME;
const collectionName = process.env.COLLECTION_NAME;

async function initializeMongoClient() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB server");
        const db = client.db(dbName);
        const collectionExists = await checkCollectionExists(db, collectionName);
        if (!collectionExists) {
            await db.createCollection(collectionName);
            console.log(`Collection "${collectionName}" created`);
        }
        return { client, db, collection: db.collection(collectionName) };
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}


async function checkCollectionExists(db, collectionName) {
    const collections = await db.listCollections().toArray();
    return collections.some(collection => collection.name === collectionName);
}

async function closeMongoClient(client) {
    try {
        await client.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        throw error;
    }
}

module.exports = { initializeMongoClient, closeMongoClient };
