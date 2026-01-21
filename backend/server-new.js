const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// Test routes
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running");
});

app.get("/test", (req, res) => {
  res.json({ message: "Test working" });
});

app.get("/token", (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: "675a1234567890abcdef1234" }, process.env.JWT_SECRET);
  res.json({ token });
});

// Medicine routes
const Medicine = require("./src/models/Medicine");

app.get("/api/medicine", async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    const active = medicines.filter(m => m.quantity > 0);
    const lowStock = medicines.filter(m => m.quantity > 0 && m.quantity < 5);
    res.json({ active, lowStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/medicine/add", async (req, res) => {
  try {
    const { medicineName, expiryDate, quantity, schedule, aiExplanation } = req.body;
    const medicine = await Medicine.create({
      userId: "675a1234567890abcdef1234",
      medicineName,
      expiryDate,
      quantity,
      schedule,
      aiExplanation
    });
    res.json({ message: "Medicine added", medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});