const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const Doc = require("../models/docs");
const { callGPT25 } = require("../utils/llm");
 

router.post("/", async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    let convo = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({ messages: [] });

    const docs = await Doc.find({});
    const context = docs.map(d => d.content).join("\n\n");

    const prompt = `
      FAQ:
      ${context}

      User: ${message}
      Assistant:
    `;

    const aiReply = await callGPT25(prompt);

    convo.messages.push({ role: "user", text: message });
    convo.messages.push({ role: "assistant", text: aiReply });
    await convo.save();

    res.json({ reply: aiReply, conversationId: convo._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;