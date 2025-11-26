const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const conversationRoutes = require("./routes/conversation");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/conversation", conversationRoutes);
app.use("/api/chat", require("./routes/chat"));
app.use("/api/docs", require("./routes/docs"));

app.listen(4000, () => console.log("Backend running on 4000"));
