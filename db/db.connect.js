require("dotenv").config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("connected to database.");
    })
    .catch((error) => {
      console.log("Error connecting to the databse", error);
    });
};

module.exports = { initializeDatabase };
