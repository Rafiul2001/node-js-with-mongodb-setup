const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.URI;
const dbName = process.env.DBNAME;
const collectionArray = process.env.COLLECTION_ARRAY;

async function initializeMongoClient() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB server");
        const db = client.db(dbName)
        
        // For collection array COLLECTION_ARRAY
        const arrOfCollection = JSON.parse(collectionArray)
        await checkCollections(arrOfCollection, db)
    
        return { client: client, db: db};
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

async function checkCollections(collArr, db) {
    collArr.forEach(async (collection) => {
        let collectionExists = await checkCollectionExists(db, collection);
        if (!collectionExists) {
            await db.createCollection(collection);
            console.log(`Collection "${collection}" created`);
        }
    });
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
