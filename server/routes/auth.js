const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { query } = require('../config/databaseConfig');
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Configure Passport's Local Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const results = await query('SELECT * FROM admin_cred WHERE username = ?', [username]);
        const admin = results[0];

        if (!admin) {
            return done(null, false, { message: 'User not found.' });
        }

        const match = await bcrypt.compare(password, admin.password);
        if (match) {
            return done(null, admin);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    try {
        const results = await query('SELECT * FROM admin_cred WHERE username = ?', [username]);
        done(null, results[0]);
    } catch (err) {
        done(err);
    }
});

// Register route
router.post('/registerAdmin', async (req, res) => {
    const { firstNameInput, middleNameInput, lastNameInput, positionInput, statusInput, usernameInput, passwordInput } = req.body;

    try {
        const results = await query('SELECT COUNT(*) AS count FROM admin_cred');
        const userCount = results[0].count;

        if (userCount > 0) {
            // console.log("wow")
            if (req.isAuthenticated()) {
                await registerAdmin();
            } else {
                return res.status(401).json({ message: 'You are not authorized to register.' });
            }
        }        
        
        await registerAdmin();

    } catch (err) {
        console.error('Error checking users:', err);
        return res.status(500).json({ message: 'Database error' });
    }

    async function registerAdmin() {
        try {
            // Check if the username already exists
            const existingUser = await query('SELECT * FROM admin_cred WHERE username = ?', [usernameInput]);

            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
            }

            const hashedPassword = await bcrypt.hash(passwordInput, 10);
            const employee = await query(
                'INSERT INTO employee (first_name, middle_name, last_name, position_id, employee_status) VALUES (NULLIF(?, ""), NULLIF(?, ""), NULLIF(?, ""), NULLIF(?, ""), NULLIF(?, ""))',
                [firstNameInput, middleNameInput, lastNameInput, positionInput, statusInput]
            );

            const employeeId = employee.insertId || employee[0]?.insertId;

            await query(
                'INSERT INTO admin_cred (employee_id, username, password) VALUES (?, ?, ?)',
                [employeeId, usernameInput, hashedPassword]
            );

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ message: 'Error registering user' });
        }
    }
});

// Login route
router.post('/login', ensureNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, admin, info) => {
        if (err) return res.status(500).json({ message: 'Internal server error.' });
        if (!admin) return res.status(401).json({ message: info.message || 'Authentication failed.' });

        req.logIn(admin, (err) => {
            if (err) return res.status(500).json({ message: 'Login error.' });
            return res.status(200).json({ message: 'Login successful!', redirectUrl: '/dashboard', admin: admin });
        });
    })(req, res, next);
});

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;
