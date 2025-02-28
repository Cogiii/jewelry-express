const path = require('path');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, respond with a 401 Unauthorized status
    // return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    return res.redirect('/login');
}

module.exports = ensureAuthenticated;