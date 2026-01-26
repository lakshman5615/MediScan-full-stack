const express = require('express');
const app = express();
app.use(express.json());

// Routes
const medicineRoutes = require('./src/routes/medicine.routes');
app.use('/api/medicine', medicineRoutes);

module.exports = app;
