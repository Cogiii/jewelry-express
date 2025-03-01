const express = require('express');
const path = require('path');

const { ensureAuthenticated } = require('../middleware/auth')
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/public/register/index.html"));
});

module.exports = router;