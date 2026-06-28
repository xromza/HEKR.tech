ALTER TABLE products ADD COLUMN brand varchar(256);

UPDATE products SET brand = 'Gucci' WHERE id = 1;
UPDATE products SET brand = 'Dolce & Gabbana' WHERE id = 2;
UPDATE products SET brand = 'Prada' WHERE id = 3;

ALTER TABLE products ALTER COLUMN brand SET NOT NULL;