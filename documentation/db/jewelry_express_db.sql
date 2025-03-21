-- JEWELRY EXPRESS DATABASE
-- =========================================
-- Description:
-- This script initializes the "jewelry_express_db" database schema. 
-- It defines tables, relationships, and triggers for managing employees, products, customers, and appointments.
-- Includes enforcement rules via triggers to maintain data integrity.

-- Note: Ensure to drop the existing database if it exists before running this script.
-- Query: DROP DATABASE jewelry_express_db;

-- CREATED BY: Laurence Kharl Devera
-- =========================================

--  UNCOMMENT THE MESSAGE BELOW TO ENABLE EVENT SCHEDULER IF ERROR EXISTS on EVENT
SET GLOBAL event_scheduler = ON;

-- UNCOMMENT THE QUERY BELOW TO REPAIR THE EVENT TABLE IF ERROR EXISTS on EVENT
-- REPAIR TABLE mysql.event;

DROP DATABASE IF EXISTS jewelry_express_db;
CREATE DATABASE jewelry_express_db;
USE jewelry_express_db;

CREATE TABLE positions (
    position_id INT PRIMARY KEY AUTO_INCREMENT,
    position_name VARCHAR(255) NOT NULL
);

CREATE TABLE employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    position_id INT,
    employee_status ENUM('admin', 'staff', 'resigned') NOT NULL DEFAULT 'staff',
    FOREIGN KEY (position_id) REFERENCES positions(position_id) ON DELETE SET NULL
);

CREATE TABLE employee_contact (
    employee_contact_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    contact_number VARCHAR(13),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE admin_cred (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

CREATE TABLE password_history (
    password_history_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

CREATE TABLE product_material (
    product_material_id INT PRIMARY KEY AUTO_INCREMENT,
    product_material VARCHAR(255) NOT NULL
);

CREATE TABLE product_type (
    product_type_id INT PRIMARY KEY AUTO_INCREMENT,
    product_type VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    product_type_id INT,
    product_material_id INT,
    product_description VARCHAR(255),
    admin_id INT NOT NULL,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (product_type_id) REFERENCES product_type(product_type_id),
    FOREIGN KEY (product_material_id) REFERENCES product_material(product_material_id),
    FOREIGN KEY (admin_id) REFERENCES admin_cred(admin_id)
);

CREATE TABLE product_coding (
    product_code VARCHAR(255) PRIMARY KEY,
    product_id INT,
    is_sold BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE product_image (
    product_image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    image_data LONGBLOB,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE customer_email (
    email_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    email VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE customer_contact (    
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    contact_number VARCHAR(13),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE appointment (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    employee_id INT,
    date_appointed DATETIME DEFAULT CURRENT_TIMESTAMP,
    sched_of_appointment DATETIME,
    appointment_purpose VARCHAR(255),
    appointment_status ENUM('pending', 'approve', 'cancelled', 'done') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE appointment_service (
    appointment_service_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    appointment_service VARCHAR(255) NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

CREATE TABLE appointment_approval (
    approval_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    admin_id INT,
    date_processed DATETIME DEFAULT CURRENT_TIMESTAMP, 
    remarks VARCHAR(255),
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id),
    FOREIGN KEY (admin_id) REFERENCES admin_cred(admin_id)
);

CREATE TABLE appointment_product (
    appointment_product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    appointment_id INT,
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

CREATE TABLE purchase (
    purchase_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    date_purchased DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

CREATE TABLE purchase_details (
    purchase_details_id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT,
    product_id INT,
    product_code VARCHAR(255),
    FOREIGN KEY (purchase_id) REFERENCES purchase(purchase_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (product_code) REFERENCES product_coding(product_code)
);

-- ==============================================================
-- TRIGGERS FUNCTIONS
-- Triggeres wont work especially on hosted db (unless we have privilege)

-- ONLY ADMIN (employee_status) can be create an admin account
DELIMITER $$

CREATE TRIGGER enforce_admin_only
BEFORE INSERT ON admin_cred
FOR EACH ROW
BEGIN
    DECLARE emp_status ENUM('admin', 'staff', 'resigned');
    
    SELECT employee_status 
    INTO emp_status 
    FROM employee 
    WHERE employee_id = NEW.employee_id;
    
    IF emp_status != 'admin' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Only employees with admin status can be added to admin_cred.';
    END IF;
END $$

DELIMITER ;


-- EMPLOYEE TABLE
-- IF THE VALUE IS NOT IN the ENUM then just set to default value 'staff'
DELIMITER $$

CREATE TRIGGER enforce_valid_status
BEFORE INSERT ON employee
FOR EACH ROW
BEGIN
    IF NEW.employee_status NOT IN ('admin', 'staff', 'resigned') THEN
        SET NEW.employee_status = 'staff';
    END IF;
END $$

DELIMITER ;


-- APPOINTMENT TABLE
-- IF THE VALUE IS NOT IN the ENUM then just set to default value 'pending'
DELIMITER $$

CREATE TRIGGER enforce_valid_appointment_status
BEFORE INSERT ON appointment
FOR EACH ROW
BEGIN
    IF NEW.appointment_status NOT IN ('pending', 'approve', 'cancelled', 'done') THEN
        SET NEW.appointment_status = 'pending';
    END IF;
END $$

DELIMITER ;


-- APPOINTMENT TABLE
-- IF THE SCHEDULED DATE IS LESS THAN THE CURRENT DATE THEN SET TO 'cancelled'
DROP EVENT IF EXISTS auto_cancel_expired_appointments;
DELIMITER $$

CREATE EVENT auto_cancel_expired_appointments
ON SCHEDULE EVERY 30 MINUTE
DO
BEGIN
    -- Insert records into appointment_approval for expired pending appointments
    INSERT INTO appointment_approval (appointment_id, date_processed, remarks)
    SELECT appointment_id, NOW(), 'Appointment automatically cancelled due to no processing within the scheduled time.'
    FROM appointment
    WHERE appointment_status = 'pending' AND sched_of_appointment < NOW();

    -- Update appointment status to 'cancelled'
    UPDATE appointment
    SET appointment_status = 'cancelled'
    WHERE appointment_status = 'pending' AND sched_of_appointment < NOW();
END $$

DELIMITER ;
