const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Import routes
const medicineRoutes = require("./src/routes/medicine.routes");

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/medicine", medicineRoutes);

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running");
});

// Test token route
app.get("/token", (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: "675a1234567890abcdef1234" }, process.env.JWT_SECRET);
  res.json({ token });
});

// Start cron jobs
require("./src/cron/reminder.cron");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
