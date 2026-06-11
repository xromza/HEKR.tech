-- INDEX CARTS.USER_ID --

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts (user_id);

-- INDEX IMAGES.VARIANT_ID --

CREATE INDEX IF NOT EXISTS idx_images_variant_id ON images (variant_id);

-- INDEX USERS.EMAIL --
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);