const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Auth test route
app.get('/auth/test', (req, res) => {
    res.json({ message: 'Auth routes working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});