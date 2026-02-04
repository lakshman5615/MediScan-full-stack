 const express = require('express');
const app = express(); // ✅ pehle define karo
app.use(express.json()); // ✅ phir use karo

// Initialize cron jobs
require('./src/cron');

console.log('🔥 APP.JS LOADED');

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Cabinet API is running 🚀');
});

// Routes
const medicineRoutes = require('./src/routes/medicine.routes');
const authRoutes = require('./src/routes/auth.routes');
const medicineActionRoutes = require('./src/routes/medicine-actions.routes');
const doseRoutes = require('./src/routes/dose.routes');
const notificationRoutes = require('./src/routes/notification.routes');

app.use('/api/medicine', medicineRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/medicine-action', medicineActionRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;
