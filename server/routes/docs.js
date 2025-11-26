const express = require("express");
const Doc = require("../models/docs");

const router = express.Router();

 
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Content is required" });
    }

    const doc = await Doc.create({ content });
    res.status(201).json({ message: "FAQ uploaded successfully", doc });
  } catch (err) {
    console.error("Error uploading FAQ:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
