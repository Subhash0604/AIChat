const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: String,   
  text: String,
});

const ConversationSchema = new mongoose.Schema({
  messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
