
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/auth.routes");
const aiRoutes = require("./src/routes/ai.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const medicineRoutes = require('./src/routes/medicine.routes');
const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
const doseRoutes = require('./src/routes/dose.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const phoneUserRoutes = require('./src/routes/phone-user.routes');
const reminderRoutes = require('./src/routes/reminder.routes');
const alertRoutes = require('./src/routes/alert.routes'); // ✅ Alert routes
// ✅ INIT APP FIRST
const app = express();

// ✅ MIDDLEWARES - Allow any device on same network
app.use(cors({
  origin: true, // Allow all origins (same network devices)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Connect DB FIRST
connectDB().then(async () => {
  // ✅ Fix lowStockThreshold for existing medicines
  const Medicine = require('./src/models/Medicine');
  try {
    const result = await Medicine.updateMany(
      { $or: [{ lowStockThreshold: { $ne: 2 } }, { lowStockThreshold: { $exists: false } }] },
      { $set: { lowStockThreshold: 2 } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Fixed lowStockThreshold for ${result.modifiedCount} medicines`);
    }
  } catch (err) {
    console.error('⚠️ Failed to update lowStockThreshold:', err.message);
  }
  
  // Cron jobs (start AFTER DB connection)
  require('./src/cron/medicine-reminder.cron');
  require('./src/cron/alerts.cron');
  console.log('✅ Cron jobs initialized');
});

// Root route
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/reminder', reminderRoutes);
app.use("/api/medicine", medicineRoutes);
app.use('/api/medicine-action', medicineActionRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/alerts', alertRoutes); // ✅ Alert API endpoint

console.log('✅ All routes registered including /api/alerts');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // ✅ Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🔥 Server running on ${HOST}:${PORT}`);
  console.log(`🌐 Access from other devices: http://YOUR_IP:${PORT}`);
});