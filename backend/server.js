const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const authRoutes = require("./src/routes/auth.routes");

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app
// app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
