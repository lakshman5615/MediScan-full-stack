const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});

//  test user route (listen se pehle)
app.get("/test-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Laxman",
      email: "laxman@gmail.com",
      password: "test123",
      phone: "9876543210"
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
