const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Mediscan backend running 🚀");
});

module.exports = app; // <-- THIS LINE IS VERY IMPORTANT
