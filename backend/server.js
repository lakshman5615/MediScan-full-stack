const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
dotenv.config();
const authRoutes = require("./src/routes/auth.routes");
const aiRoutes = require("./src/routes/ai.routes");
const helmet = require('helmet');
const dashboardRoutes = require("./src/routes/dashboard.routes")

// Cron jobs
require('./src/cron/medicine-reminder.cron');
require('./src/cron/alerts.cron');

// Import routes
const medicineRoutes = require('./src/routes/medicine.routes');
const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
const doseRoutes = require('./src/routes/dose.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const phoneUserRoutes = require('./src/routes/phone-user.routes');
const reminderRoutes = require('./src/routes/reminder.routes');


const app = express();
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true }));




// 🔐 SECURITY FIRST
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Root route
app.get('/', (req, res) => res.send('Cabinet API is running 🚀'));

// Connect MongoDB
connectDB();

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running ");
});
app.use("/auth", authRoutes);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/medicine-action', medicineActionRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/phone-user', phoneUserRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/reminder', reminderRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Cabinet service running on port ${PORT}`));
