const express = require('express');
const path = require('path');
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/public/login/index.html"));
});

module.exports = router;