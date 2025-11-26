const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema({
  title: String,
  content: { type: String, required: true },
});

module.exports = mongoose.model("Doc", DocSchema);
