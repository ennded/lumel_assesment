// this is for db connectivity
const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
