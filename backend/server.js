const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
dotenv.config();
const authRoutes = require("./src/routes/auth.routes");
const aiRoutes = require("./src/routes/ai.routes");



const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app
// app.use(express.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});
app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




