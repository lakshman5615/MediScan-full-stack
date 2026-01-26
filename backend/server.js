const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const authRoutes = require("./src/routes/auth.routes");
const medicineRoutes = require("./src/routes/medicine.routes");

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// connect DB
connectDB();

// root test
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});

// Web notifications page
app.get("/web", (req, res) => {
  res.sendFile(path.join(__dirname, "get-real-fcm-token.html"));
});

// Service worker for FCM
app.get("/firebase-messaging-sw.js", (req, res) => {
  res.sendFile(path.join(__dirname, "firebase-messaging-sw.js"));
});

console.log('Loading auth routes...');
app.use("/auth", authRoutes);

console.log('Loading medicine routes...');
app.use("/medicine", medicineRoutes);

console.log('Loading notification routes...');
const notificationRoutes = require("./src/routes/notification.routes");
app.use("/notification", notificationRoutes);

// Additional notification methods (for testing/admin - not loaded by default)
// const notificationMethodsRoutes = require("./src/routes/notification-methods.routes");
// app.use("/notification-methods", notificationMethodsRoutes);

console.log('Loading phone user routes...');
const phoneUserRoutes = require("./src/routes/phone-user.routes");
app.use("/phone-user", phoneUserRoutes);

console.log('Loading medicine actions routes...');
const medicineActionsRoutes = require("./src/routes/medicine-actions.routes");
app.use("/medicine-actions", medicineActionsRoutes);

console.log('Loading admin routes...');
const adminRoutes = require("./src/routes/admin.routes");
app.use("/admin", adminRoutes);

// Start production cron jobs
require("./src/cron/production-reminder.cron");
console.log('🔔 Production notification system started');


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});