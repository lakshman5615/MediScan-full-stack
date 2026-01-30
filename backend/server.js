require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
// require('./src/cron/medicine-reminder.cron');
require('./src/cron/alerts.cron');


const app = express();
app.use(express.json());

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

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const medicineRoutes = require('./src/routes/medicine.routes');
const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
const doseRoutes = require('./src/routes/dose.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const phoneUserRoutes = require('./src/routes/phone-user.routes');
const cabinetRoutes = require('./src/routes/cabinet.routes');
const reminderRoutes = require('./src/routes/reminder.routes');

app.use('/api/cabinet', cabinetRoutes);
app.use('/api/reminder', reminderRoutes);

// Use routes
app.use('/api/auth', authRoutes);

app.use('/api/medicine', medicineRoutes);
app.use('/api/medicine-action', medicineActionRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/phone-user', phoneUserRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Cabinet service running on port ${PORT}`));
