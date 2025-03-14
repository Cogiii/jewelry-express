const express = require('express');
const path = require('path');

const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Protected admin route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/admin/dashboard/index.html"));
});
router.get('/appointments', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/admin/appointments/index.html"));
});
router.get('/products', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/admin/products/index.html"));
});
router.get('/employees', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/admin/employees/index.html"));
});
router.get('/settings', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/admin/settings/index.html"));
});

module.exports = router;