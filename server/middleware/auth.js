const path = require('path');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns If auth proceed to action, if not direct to login page
 */
function ensureAuthenticated(req, res, next) {
    // console.log("CHECK AUTH", req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    // User is not authenticated, respond with a 401 Unauthorized status
    // return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
    res.redirect('/login');
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns if auth proceed directly to the admin or dashboard, if not then proceed to action
 */
function ensureNotAuthenticated(req, res, next) {
    // console.log("CHECK NOT AUTH:", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = { ensureAuthenticated, ensureNotAuthenticated };