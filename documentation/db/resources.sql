-- Jewelry Express 
-- ==============================================
-- Description:
-- This script inserts predefined data into the database, 
-- specifically for product materials and product types.
-- It ensures that standard materials and types are available 
-- for product classification in the system.


-- Create by: Laurence Kharl Devera
-- ==============================================
USE jewelry_express_db;

INSERT INTO position (position_name) VALUES
    ("admin"),
    ("Cashier");

INSERT INTO product_material (product_material) VALUES 
    ("Gold"),
    ("Silver"),
    ("Diamond"),
    ("Platinum"),
    ("Pearl"),
    ("Copper");

INSERT INTO product_type (product_type) VALUES
    ("Necklace"),
    ("Bracelet"),
    ("Earring"),
    ("Ring");
