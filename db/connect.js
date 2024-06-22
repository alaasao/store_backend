const mongoose = require("mongoose")
const connectDB = (url) => {
    return mongoose.connect(url);
}; // create a function to connect to the database

module.exports = connectDB; 