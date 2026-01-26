const app = require('./app');
const connectDB = require('./src/config/db');
require('dotenv').config();
require('./src/cron/medicine-reminder.cron');


const PORT = process.env.PORT || 5001;
app.get('/', (req, res) => {
  res.send('MediScan API is running 🚀');
});

// Connect MongoDB
connectDB();

// routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/medicine', require('./src/routes/medicine.routes'));
app.use('/api/medicine-action', require('./src/routes/medicine-actions.routes'));

app.use('/api/dose', require('./src/routes/dose.routes'));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Cabinet service running on port ${PORT}`);
});
