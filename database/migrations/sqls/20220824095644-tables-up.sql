/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS users
(
    user_id      SERIAL PRIMARY KEY,
    name         TEXT,
    email        TEXT,
    password     TEXT,
    is_user      BOOLEAN   DEFAULT false,
    is_seller    BOOLEAN   DEFAULT false,
    is_admin     BOOLEAN   DEFAULT false,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP,
    archived_at  TIMESTAMP
);

CREATE UNIQUE INDEX unique_user on users(email)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS user_address
(
    address_id   SERIAL PRIMARY KEY,
    address      TEXT,
    user_id      INT REFERENCES users (user_id) NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP,
    archived_at  TIMESTAMP
);

CREATE UNIQUE INDEX unique_user_address on user_address(address,user_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS products
(
    product_id   SERIAL PRIMARY KEY,
    name         TEXT,
    seller_id    INT REFERENCES users (user_id) NOT NULL,
    category     TEXT,
    created_at   TIMESTAMP DEFAULT NOW(),
    archived_at  TIMESTAMP
);

CREATE UNIQUE INDEX unique_product on products(name,seller_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS product_details
(
    product_detail_id   SERIAL PRIMARY KEY,
    product_id          INT REFERENCES products (product_id) NOT NULL,
    colour              TEXT,
    stock_quantity      INT NOT NULL,
    price               INT NOT NULL,
    created_at          TIMESTAMP DEFAULT NOW(),
    archived_at         TIMESTAMP
);

CREATE UNIQUE INDEX unique_product_details on product_details(product_id,colour)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS product_address
(
    address_id              SERIAL PRIMARY KEY,
    address                 TEXT,
    product_detail_id       INT REFERENCES product_details (product_detail_id) NOT NULL,
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP,
    archived_at             TIMESTAMP
);

CREATE UNIQUE INDEX unique_product_address on product_address(address,product_detail_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS sessions
(
    session_id          SERIAL PRIMARY KEY,
    user_id             INT REFERENCES users (user_id) NOT NULL,
    start_time          TIMESTAMP DEFAULT NOW(),
    end_time            TIMESTAMP DEFAULT NOW() + INTERVAL '30minutes',
    is_ended            BOOLEAN   DEFAULT false
);

CREATE TABLE IF NOT EXISTS images
(
    image_id    SERIAL PRIMARY KEY,
    name        TEXT,
    path        TEXT,
    created_at  TIMESTAMP DEFAULT NOW(),
    category    TEXT,
    archived_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images
(
    product_detail_id       INT,
    image_id                INT REFERENCES images (image_id) NOT NULL,
    archived_at             TIMESTAMP
);

CREATE UNIQUE INDEX unique_product_image on product_images(product_detail_id,image_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS user_images
(
    user_id     INT,
    image_id    INT REFERENCES images (image_id) NOT NULL,
    archived_at TIMESTAMP
);

CREATE UNIQUE INDEX unique_user_image on user_images(user_id,image_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS cart
(
    cart_id                 SERIAL PRIMARY KEY,
    user_id                 INT REFERENCES users (user_id) NOT NULL,
    product_detail_id       INT REFERENCES product_details (product_detail_id) NOT NULL,
    quantity                INT NOT NULL,
    archived_at             TIMESTAMP
);

CREATE UNIQUE INDEX unique_cart on cart(user_id,product_detail_id)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS orders
(
    order_id                SERIAL PRIMARY KEY,
    user_id                 INT REFERENCES users (user_id) NOT NULL,
    payment_method          TEXT,
    total_amount            INT NOT NULL,
    ordered_at              TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_details
(
    order_details_id        SERIAL PRIMARY KEY,
    order_id                INT REFERENCES orders (order_id) NOT NULL,
    product_detail_id       INT REFERENCES product_details (product_detail_id) NOT NULL,
    quantity                INT NOT NULL
);

