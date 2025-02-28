const express = require('express');
const { query } = require('../config/databaseConfig');

const router = express.Router();

router.get('/getPositions', (req, res) => {
    query('SELECT * FROM position', (err, results) => {
        if (err) {
            console.error('Error fetching positions:', err);
            return res.status(500).json({ message: 'Error fetching positions' });
        }
        res.json(results);
    });
});

module.exports = router;