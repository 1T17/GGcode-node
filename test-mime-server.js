const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 6991; // Different port to not conflict

// Configure static file serving exactly like your main server
app.use(express.static('public'));

// Test endpoint to check main.js
app.get('/test/main.js', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'js', 'main.js');

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Test what happens with wrong URL
app.get('/js/test/404', (req, res) => {
    res.send('<html><body>This would be the 404 HTML response</body></html>');
});

console.log('🧪 MIME Test Server Starting...');
console.log('📊 Test URLs:');
console.log(`   Static: http://localhost:${PORT}/js/main.js`);
console.log(`   Direct: http://localhost:${PORT}/test/main.js`);
console.log(`   404 Test: http://localhost:${PORT}/js/test/404`);
console.log('');
console.log('🔧 curl -I commands to test:');
console.log(`   curl -I http://localhost:${PORT}/js/main.js`);
console.log(`   curl -I http://localhost:${PORT}/test/main.js`);

app.listen(PORT, () => {
    console.log(`✅ Test server running at http://localhost:${PORT}`);
});