const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
dotenv.config();
const authRoutes = require("./src/routes/auth.routes");
const aiRoutes = require("./src/routes/ai.routes");


require('dotenv').config();


require('./src/cron/medicine-reminder.cron');
require('./src/cron/alerts.cron');

const app = express();
app.use(express.json());
app
// app.use(express.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
connectDB();

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});
app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);


// Import routes
const authRoutes = require('./src/routes/auth.routes');
const medicineRoutes = require('./src/routes/medicine.routes');
const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
const doseRoutes = require('./src/routes/dose.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const phoneUserRoutes = require('./src/routes/phone-user.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/medicine-action', medicineActionRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/phone-user', phoneUserRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




