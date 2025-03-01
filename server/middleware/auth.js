const path = require('path');

function ensureAuthenticated(req, res, next) {
    // console.log("CHECK AUTH", req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    // User is not authenticated, respond with a 401 Unauthorized status
    // return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    res.redirect('/login');
}

function ensureNotAuthenticated(req, res, next) {
    // console.log("CHECK NOT AUTH:", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.redirect('/admin');
    }
    next();
}

module.exports = { ensureAuthenticated, ensureNotAuthenticated };