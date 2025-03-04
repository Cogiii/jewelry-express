const express = require('express');
const path = require('path');

const router = express.Router();

// Define routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

router.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/appointment/index.html'));
});

// 404 Not Found Handler (should be at the end)
router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../client/public/404.html'));
});

module.exports = router;
