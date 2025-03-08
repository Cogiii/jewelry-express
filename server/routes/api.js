const express = require('express');
const multer = require('multer');


const { query } = require('../config/databaseConfig');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/getPositions', (req, res) => {
    query('SELECT * FROM positions', (err, results) => {
        if (err) {
            console.error('Error fetching positions:', err);
            return res.status(500).json({ message: 'Error fetching positions' });
        }
        res.json(results);
    });
});

router.get('/getProductMaterials', (req, res) => {
    query('SELECT * FROM product_material', (err, results) => {
        if (err) {
            console.error('Error fetching positions:', err);
            return res.status(500).json({ message: 'Error fetching positions' });
        }
        res.json(results);
    });
});

router.get('/getProductTypes', (req, res) => {
    query('SELECT * FROM product_type', (err, results) => {
        if (err) {
            console.error('Error fetching positions:', err);
            return res.status(500).json({ message: 'Error fetching positions' });
        }
        res.json(results);
    });
});

router.post('/addProduct', ensureAuthenticated, upload.single('productImage'), async (req, res) => {
    const { productName, productType, productMaterial, productDescription, productCode, adminId } = req.body;
    const productImage = req.file? req.file.buffer : null;

    if (!productName || !productType || !productMaterial || !productDescription || !productCode || !productImage || !adminId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const product = await query(
            "INSERT INTO product (product_name, product_type_id, product_material_id, product_description, product_image, admin_id) VALUES (?, ?, ?, ?, ?, ?)",
            [productName, productType, productMaterial, productDescription, productImage, adminId]
        );
        
        const productId = product.insertId;

        await query(
            "INSERT INTO product_coding (product_code, product_id) VALUES (?, ?)",
            [productCode, productId]
        );

        res.json({ message: "Product added successfully!" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Error adding product" });
    }
});

router.post('/addCustomerEmail', async (req, res) => {
    const { customerEmail } = req.body;

    if (!customerEmail) {
        return res.status(400).json({ message: "Invalid Email" });
    }

    try {
        const checkEmailExist = await query(
            "SELECT COUNT(*) AS count FROM customer_email WHERE email = ? ",
            [customerEmail]
        );
        const isEmailExist = checkEmailExist[0].count;

        if(isEmailExist > 0) {
            return res.status(409).json({ message: "This email is already subscribed" });
        }

        const insertEmail = await query(
            "INSERT INTO customer_email (email) VALUES (?)",
            [customerEmail]
        );

        if(!insertEmail.insertId) {
            return res.status(500).json({ message: "Error adding email" });
        }

        res.status(201).json({ message: 'Email has been successfully subscribed.' });
    } catch (error) {
        console.error("Error adding email:", error);
        return res.status(500).json({ message: "Error adding email" });
    } 
});

router.get("/getUnavailableTimes/:date", async (req, res) => {
    const { date } = req.params; // Extract from params correctly
    if (!date) return res.status(400).json({ error: "Date is required" });

    try {
        const result = await query(
            "SELECT TIME_FORMAT(sched_of_appointment, '%l:%i %p') AS time FROM appointment WHERE DATE(sched_of_appointment) = ?",
            [date]
        );

        res.status(200).json({ unavailableTimes: result.map(row => row.time) });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;