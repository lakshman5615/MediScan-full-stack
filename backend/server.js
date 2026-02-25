// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./src/config/db");
// const User = require("./src/models/User");
// dotenv.config();
// const authRoutes = require("./src/routes/auth.routes");
// const aiRoutes = require("./src/routes/ai.routes");
// const cabinetRoutes = require('./src/routes/cabinet.routes');
// app.use('/api/cabinet', cabinetRoutes);


// require('dotenv').config();

// const dashboardRoutes = require("./src/routes/dashboard.routes")

// const app = express();



// // middlewares
// app.use(cors());

// // 🔐 SECURITY FIRST
// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// // Cron jobs

// require('./src/cron/medicine-reminder.cron');
// require('./src/cron/alerts.cron');

// const app = express();
// app.use(express.json());
// app
// // Import routes
// const medicineRoutes = require('./src/routes/medicine.routes');
// const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
// const doseRoutes = require('./src/routes/dose.routes');
// const notificationRoutes = require('./src/routes/notification.routes');
// const phoneUserRoutes = require('./src/routes/phone-user.routes');
// const reminderRoutes = require('./src/routes/reminder.routes');



// // middlewares


// // app.use(express.urlencoded({ extended: true }));

// // app.use(express.urlencoded({ extended: true }));




// // app.use(cors({
// //   origin: 'http://localhost:5173',
// //   credentials: true
// // }));

// // Root route
// app.get('/', (req, res) => res.send('Cabinet API is running 🚀'));

// // Connect MongoDB
// connectDB();

// // root test
// app.get("/", (req, res) => {
//   res.send("Mediscan Backend is running 🚀");
// });
// app.use("/auth", authRoutes);
// app.use("/api/ai", aiRoutes);


// // Import routes
// // const authRoutes = require('./src/routes/auth.routes');
// const medicineRoutes = require('./src/routes/medicine.routes');
// const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
// const doseRoutes = require('./src/routes/dose.routes');
// const notificationRoutes = require('./src/routes/notification.routes');
// const phoneUserRoutes = require('./src/routes/phone-user.routes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/medicine', medicineRoutes);
// app.use('/api/medicine-action', medicineActionRoutes);
// app.use('/api/dose', doseRoutes);
// app.use('/api/notification', notificationRoutes);
// app.use('/api/phone-user', phoneUserRoutes);

// // Start server
//   res.send("Mediscan Backend is running ");
// });
// app.use("/auth", authRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use('/api/reminder', reminderRoutes);
// app.use("/api/dashboard", dashboardRoutes);



// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




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
connectDB().then(() => {
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
