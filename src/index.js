const express = require('express')
const { initializeMongoClient, closeMongoClient } = require('./mongodb_connection')
const User = require('./user')

const app = express()
app.use(express.json())

let dbClient
let collection

// Initialize MongoDB connection and collection
initializeMongoClient()
    .then(({ client, db, collection: col }) => {
        dbClient = client
        collection = col
        console.log("MongoDB connection initialized")
    })
    .catch(error => {
        console.error("Error initializing MongoDB connection:", error)
        process.exit(1)
    })

app.get('/', async (req, res) => {
    try {
        const arr = []
        const query = {}
        const allUsers = collection.find(query)
        for await (const doc of allUsers) {
            arr.push(doc)
        }
        res.send(arr)
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error)
        res.status(500).send("Internal Server Error")
    }
})

app.post('/add', async (req, res) => {
    try {

        const newUser = new User(req.body.name, req.body.password, req.body.age, req.body.email)
        
        await collection.insertOne(newUser)
        res.send(newUser)
    } catch (error) {
        console.error("Error inserting data into MongoDB:", error)
        res.status(500).send("Internal Server Error")
    }
})

// Close MongoDB connection when the application exits
process.on('SIGINT', async () => {
    if (dbClient) {
        await closeMongoClient(dbClient)
        console.log("MongoDB connection closed")
    }
    process.exit(0)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})