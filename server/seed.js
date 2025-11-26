const mongoose = require("mongoose");
require("dotenv").config();
const Doc = require("./models/docs");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/chatdb";

const docs = [
  {
    title: "Working Hours",
    content: "Our customer support operates from 9 AM to 5 PM, Monday to Friday."
  },
  {
    title: "Refund Policy",
    content: "Refunds are processed within 3-5 business days after approval."
  },
  {
    title: "Support Contact",
    content: "You can reach us via email at support@example.com or call 123-456-7890."
  },
  {
    title: "Shipping Policy",
    content: "Orders are shipped within 2 business days. Standard delivery takes 5-7 business days."
  },
  {
    title: "Account Issues",
    content: "For account recovery or password reset, please use the 'Forgot Password' option or contact support."
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
 
    await Doc.deleteMany({});
    console.log("Cleared existing documents");
 
    await Doc.insertMany(docs);
    console.log("Seed documents inserted successfully");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
