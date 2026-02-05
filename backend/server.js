// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./src/config/db");
// const User = require("./src/models/User");
// dotenv.config();
// const authRoutes = require("./src/routes/auth.routes");
// const aiRoutes = require("./src/routes/ai.routes");
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

// ✅ INIT APP FIRST
const app = express();

// ✅ MIDDLEWARES AFTER APP INIT

 app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
 }));

// app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// ✅ CORS — FIRST, ALWAYS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Explicit preflight


// ✅ Helmet AFTER cors

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Cron jobs (side-effects only)
require('./src/cron/medicine-reminder.cron');
require('./src/cron/alerts.cron');

// Root route
app.get("/", (req, res) => {
  res.send("Mediscan Backend is running 🚀");
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/reminder', reminderRoutes);

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
