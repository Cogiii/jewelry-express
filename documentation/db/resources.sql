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

INSERT INTO positions (position_name) VALUES
    ("admin"),
    ("Employee");

INSERT INTO product_material (product_material) VALUES 
    ("Gold"),
    ("Amethyst"),
    ("Diamond");

INSERT INTO product_type (product_type) VALUES
    ("Ring"),
    ("Earring"),
    ("Necklace"),
    ("Bracelet");
