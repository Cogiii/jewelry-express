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

module.exports = router;