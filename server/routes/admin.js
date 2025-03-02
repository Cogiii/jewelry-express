const express = require('express');
const path = require('path');

const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Protected admin route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/admin/dashboard/index.html"));
});



module.exports = router;