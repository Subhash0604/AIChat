const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");

router.get("/:id", async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.id);
    if (!convo) return res.status(404).json({ message: "Conversation not found" });

    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
