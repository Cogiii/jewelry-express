const express = require('express');
const bcrypt = require('bcrypt');
const { query } = require('../config/databaseConfig');
const ensureAuthenticated = require('../middleware/auth');

const router = express.Router();
require('dotenv').config();

// Register route
router.post('/registerAdmin', async (req, res) => {
    const { firstNameInput, middleNameInput, lastNameInput, positionInput, statusInput, usernameInput, passwordInput } = req.body;

    // Convert empty strings to NULL
    const firstName = firstNameInput || null;
    const middleName = middleNameInput || null;
    const lastName = lastNameInput || null;
    const position = positionInput || null;
    const status = statusInput || null;
    const username = usernameInput || null;
    const password = passwordInput || null;

    try {
        // Check if any users exist in the database
        // const results = await query('SELECT COUNT(*) AS count FROM admin');
        // const userCount = results[0].count;
        
        // if (userCount > 0) {
        //     // If users exist, require authentication
        //     return ensureAuthenticated(req, res, async () => {
        //         await registerAdmin();
        //     });
        // }
        
        // If no users exist, allow registration
        await registerAdmin();

    } catch (err) {
        console.error('Error checking users:', err);
        return res.status(500).json({ message: 'Database error' });
    }

    // Function to register the employee
    async function registerAdmin() {
        try {
            const hashedPassword = await bcrypt.hash(passwordInput, 10);
            const employee = await query(
                'INSERT INTO employee (first_name, middle_name, last_name, position_id, employee_status) VALUES (NULLIF(?, ""), NULLIF(?, ""), NULLIF(?, ""), NULLIF(?, ""), NULLIF(?, ""))',
                [firstNameInput, middleNameInput, lastNameInput, positionInput, statusInput]
            );

            const employeeId = employee.insertId;

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

module.exports = router;
