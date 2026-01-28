console.log('🔥 SERVER.JS STARTED');

require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
require('./src/cron/medicine-reminder.cron');

const app = express();
app.use(express.json());

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

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/medicine-action', medicineActionRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/phone-user', phoneUserRoutes);

//  server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Cabinet service running on port ${PORT}`);
});
