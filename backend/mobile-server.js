const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;

// Serve static files
app.use(express.static(__dirname));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mobile-fcm-test.html'));
});

app.listen(PORT, () => {
    console.log(`📱 Mobile FCM Server running on http://localhost:${PORT}`);
    console.log(`🔗 Open: http://localhost:${PORT}/mobile-fcm-test.html`);
});