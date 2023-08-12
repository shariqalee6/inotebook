const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = process.env.DATABASE_URL

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo
