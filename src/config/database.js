const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://nodeProject:mnOHqfh0ExwwxHpG@nodeproject.vnjiqv5.mongodb.net/devTinder");
};

module.exports = {connectDB};

