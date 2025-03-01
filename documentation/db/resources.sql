-- Jewelry Express 
-- ==============================================
-- Description:
-- A query script for inserting resources in database.
-- Includes inserting 
--  - product_materials, 
--  - product_type


-- Create by: Laurence Kharl Devera
-- ==============================================


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
