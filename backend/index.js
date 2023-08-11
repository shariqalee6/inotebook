const connectToMongo = require('./db');
const express = require('express')
// Call the connectToMongo function
connectToMongo()
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send("1st Request received")
})

app.listen(port, () => {
    console.log(`Example app is listening at http://localhost:${port}`)
})