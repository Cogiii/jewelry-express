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

module.exports = router;
