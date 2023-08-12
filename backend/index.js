const connectToMongo = require('./db');
const express = require('express')
require('dotenv').config()
// Call the connectToMongo function
connectToMongo()
const app = express()
const port = process.env.PORT
app.use(express.json())
//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app is listening at http://localhost:${port}`)
})