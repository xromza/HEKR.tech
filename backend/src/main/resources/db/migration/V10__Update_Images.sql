UPDATE images SET url = 'https://res.cloudinary.com/dcc2qkmq7/image/upload/v1781890519/jacket_back_fp3oai.png' WHERE id = 2;
UPDATE images SET url = 'https://res.cloudinary.com/dcc2qkmq7/image/upload/v1781890519/jacket_left_svgaov.png' WHERE id = 3;

INSERT INTO images (url, variant_id, type, sort_order, created_at) VALUES 
    ('https://res.cloudinary.com/dcc2qkmq7/image/upload/v1781890519/asian_ozquof.png', 1, 'GALLERY', 3, now()),
    ('https://res.cloudinary.com/dcc2qkmq7/image/upload/v1781890519/pidjak_back_ybnand.png', 10, 'GALLERY', 1, now()),
    ('https://res.cloudinary.com/dcc2qkmq7/image/upload/v1781890519/pidjak_rukav_a5xo0n.png', 10, 'GALLERY', 2, now()),
    ('https://res.cloudinary.com/dcc2qkmq7/image/upload/v1781890519/pidjak_rear_zambyw.png', 10, 'GALLERY', 3, now());