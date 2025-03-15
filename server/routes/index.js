const express = require('express');
const path = require('path');

const router = express.Router();

// Define routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

router.get('/appointment/:productId?', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/appointment/index.html'));
});
router.get('/jewelries', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/jewelries/index.html'));
});
router.get('/collection/:productId', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/collection/index.html'));
});

module.exports = router;
