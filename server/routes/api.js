const express = require('express');
const multer = require('multer');

const { query } = require('../config/databaseConfig');
const { ensureAuthenticated } = require('../middleware/auth');

const app = express();
app.use(express.json());
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

router.post('/addProduct', ensureAuthenticated, upload.array('productImages', 8), async (req, res) => {
    const { productName, productType, productMaterial, productDescription, productCode, adminId } = req.body;
    const productImages = req.files;

    if (!productName || !productType || !productMaterial || !productDescription || !productCode || !adminId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Insert the product and get its ID
        const product = await query(
            "INSERT INTO product (product_name, product_type_id, product_material_id, product_description, admin_id) VALUES (?, ?, ?, ?, ?)",
            [productName, productType, productMaterial, productDescription, adminId]
        );

        const productId = product.insertId;

        await query(
            "INSERT INTO product_coding (product_code, product_id) VALUES (?, ?)",
            [productCode, productId]
        );

        if (productImages.length > 0) {
            for (const image of productImages) {
                await query(
                    "INSERT INTO product_image (product_id, image_data) VALUES (?, ?)",
                    [productId, image.buffer]
                );
            }
        }

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
    const { date } = req.params;
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

router.get("/checkIfDateAndTimeAvailable", async (req, res) => {
    const { date, time } = req.query;
    if (!date || !time) return res.status(400).json({ error: "Date and time are required" });

    try {
        const result = await query(
            "SELECT COUNT(*) AS count FROM appointment WHERE DATE_FORMAT(sched_of_appointment, '%M %e, %Y') = ? AND TIME_FORMAT(sched_of_appointment, '%l:%i %p') = ?",
            [date, time]
        );

        res.status(200).json({ isAvailable: result[0].count === 0 });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/addAppointment', upload.none(), async (req, res) => {
    const { 
        firstName, 
        lastName, 
        contactNumber, 
        email, 
        purpose, 
        services, 
        date, 
        time 
    } = req.body;

    // console.log(firstName, lastName, contactNumber, email, purpose, services, date, time);

    if (!firstName || !lastName || !contactNumber || !email || !purpose || !services || !date || !time) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Convert date object to YYYY-MM-DD format
        const parsedDate = JSON.parse(date);
        const formattedDate = `${parsedDate.year}-${String(parsedDate.month).padStart(2, '0')}-${String(parsedDate.day).padStart(2, '0')}`;

        // Convert time to fixed 12:00:00 format
        const formattedTime = convertTo24HourFormat(time);
        const parsedServices = JSON.parse(services);

        // console.log(formattedDate, formattedTime);

        const checkIfCustomerExist = await query(
            "SELECT * FROM customer WHERE first_name = ? AND last_name = ?",
            [firstName, lastName]
        );
        let customer_id = null;

        if(checkIfCustomerExist.length > 0) {
            customer_id = checkIfCustomerExist[0].customer_id;
        } else {
            const insertCustomer = await query(
                "INSERT INTO customer (first_name, last_name) VALUES (?, ?)",
                [firstName, lastName, contactNumber, email]
            );

            customer_id = insertCustomer.insertId;
        }

        const checkIfEmailExist = await query(
            "SELECT * FROM customer_email WHERE email = ?",
            [email]
        );


        if(checkIfEmailExist.length === 0) {
            const insertEmail = await query(
                "INSERT INTO customer_email (email, customer_id) VALUES (?, ?)",
                [email, customer_id]
            );
        } else if(!checkIfEmailExist[0].customer_id) {
            query(
                "UPDATE customer_email SET customer_id = ? WHERE email_id = ?",
                [customer_id, checkIfEmailExist[0].email_id]
            );
        }

        const checkIfContactExist = await query(
            "SELECT * FROM customer_contact WHERE contact_number = ?",
            [contactNumber]
        );

        if(checkIfContactExist.length === 0) {
            const insertNumber = await query(
                "INSERT INTO customer_contact (contact_number, customer_id) VALUES (?, ?)",
                [contactNumber, customer_id]
            );
        }

        const insertAppointment = await query(
            "INSERT INTO appointment (customer_id, sched_of_appointment, appointment_purpose) VALUES (?, ?, ?)",
            [customer_id, `${formattedDate} ${formattedTime}`, purpose]
        );

        const appointmentId = insertAppointment.insertId;

        await Promise.all(
            parsedServices.map(service => 
                query(
                    "INSERT INTO appointment_service (appointment_id, appointment_service) VALUES (?, ?)",
                    [appointmentId, service]
                )
            )
        );        

        return res.status(201).json({ message: "Appointment added successfully!" });
    } catch (error) {
        console.error("Error:", error);
    }
});

// Convert 12-hour AM/PM time to 24-hour format
function convertTo24HourFormat(time) {
    const [rawTime, period] = time.split(" "); // Separate "11:30" and "AM/PM"
    let [hours, minutes] = rawTime.split(":").map(Number); // Extract hours and minutes

    if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12; // Convert PM hours (except 12 PM)
    } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0; // Convert 12 AM to 00
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

router.get('/getFeaturedProduct', async (req, res) => {
    try {
        const result = await query(
            `SELECT p.*, pm.product_material, pt.product_type FROM product p
            JOIN product_material pm ON p.product_material_id = pm.product_material_id
            JOIN product_type pt ON p.product_type_id = pt.product_type_id
            WHERE is_featured = 1`
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getProductImage/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await query(
            "SELECT image_data FROM product_image WHERE product_id = ?",
            [productId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const imageBuffer = result[0].image_data;

        res.setHeader("Content-Type", "image/webp");
        res.status(200).send(imageBuffer);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getProductImageById/:imageId', async (req, res) => {
    const { imageId } = req.params;

    try {
        const result = await query(
            "SELECT image_data FROM product_image WHERE product_image_id = ?",
            [imageId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const imageBuffer = result[0].image_data;

        res.setHeader("Content-Type", "image/webp");
        res.status(200).send(imageBuffer);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getAllProductImages/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await query(
            "SELECT product_image_id FROM product_image WHERE product_id = ?",
            [productId]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "No images found for this product" });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getProductMaterial/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            "SELECT product_material FROM product_material WHERE product_material_id = ?",
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.status(200).json(result[0].product_material);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getProductByMaterial/:material', async (req, res) => {
    const { material } = req.params;

    try {
        const result = await query(
            `SELECT 
                p.*, 
                pt.product_type ,
                pm.product_material
            FROM 
                product p
            JOIN 
                product_material pm ON p.product_material_id = pm.product_material_id
            JOIN 
                product_type pt ON p.product_type_id = pt.product_type_id
            WHERE 
                pm.product_material = ?`,
            [material]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Product material not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getProductByType/:type', async (req, res) => {
    const { type } = req.params;

    try {
        const result = await query(
            `SELECT 
                p.*, 
                pt.product_type ,
                pm.product_material
            FROM 
                product p
            JOIN 
                product_material pm ON p.product_material_id = pm.product_material_id
            JOIN 
                product_type pt ON p.product_type_id = pt.product_type_id
            WHERE 
                pt.product_type = ?`,
            [type]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Product type not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/getProduct/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            `SELECT 
                p.*, 
                pt.product_type ,
                pm.product_material
            FROM 
                product p
            JOIN 
                product_material pm ON p.product_material_id = pm.product_material_id
            JOIN 
                product_type pt ON p.product_type_id = pt.product_type_id
            WHERE 
                p.product_id = ?`,
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Product type not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/relatedCreations/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await query(
            `SELECT pt.product_type, pm.product_material FROM product p 
            JOIN product_type pt ON p.product_type_id = pt.product_type_id
            JOIN product_material pm ON p.product_material_id = pm.product_material_id
            WHERE product_id = ?`,
            [productId]
        );

        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { product_type, product_material } = product[0];

        const relatedCreations = await query(
            `SELECT p.product_id, p.product_name FROM product p
            JOIN product_type pt ON p.product_type_id = pt.product_type_id
            JOIN product_material pm ON p.product_material_id = pm.product_material_id
            WHERE (pt.product_type = ? OR pm.product_material LIKE ?) 
            AND p.product_id != ?
            ORDER BY RAND() LIMIT 5`,
            [product_type, `%${product_material}%`, productId]
        );

        res.status(200).json(relatedCreations);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;