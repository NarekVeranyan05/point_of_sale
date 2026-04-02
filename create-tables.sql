CREATE TABLE IF NOT EXISTS account(
    name VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart(
   id SERIAL PRIMARY KEY,
   account VARCHAR(255) UNIQUE NOT NULL,
        FOREIGN KEY (account) REFERENCES account(name)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receipt(
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    discount INTEGER NOT NULL,
    list_price INTEGER NOT NULL,
    account VARCHAR(255) NOT NULL,
        FOREIGN KEY (account) REFERENCES account(name)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_master(
    name VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    measurement_unit VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS product(
    id SERIAL PRIMARY KEY, -- I referred to name = unique for all possible products; but there may exist multiple instances of the same product
    name VARCHAR(255),
    description VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    cart INTEGER,
        FOREIGN KEY (cart) REFERENCES cart(id)
        ON DELETE CASCADE,
    receipt INTEGER,
        FOREIGN KEY (receipt) REFERENCES receipt(id)  -- the receipt where the product is in (if purchased)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coupon_master(
    name VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    percentage_off INTEGER,
    reward VARCHAR(255),
        FOREIGN KEY (reward) REFERENCES product_master(name)
        ON DELETE CASCADE,
    reward_quantity INTEGER,
    to_buy VARCHAR(255),
        FOREIGN KEY (to_buy) REFERENCES product_master(name)
        ON DELETE CASCADE,
    buy_quantity INTEGER
);

CREATE TABLE IF NOT EXISTS coupon(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
        FOREIGN KEY (name) REFERENCES coupon_master(name)
        ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    percentage_off INTEGER,
    reward VARCHAR(255),
        FOREIGN KEY (reward) REFERENCES product_master(name)
        ON DELETE CASCADE,
    reward_quantity INTEGER,
    to_buy VARCHAR(255),
        FOREIGN KEY (to_buy) REFERENCES product_master(name)
        ON DELETE CASCADE,
    buy_quantity INTEGER,
    cart INTEGER,
        FOREIGN KEY (cart) REFERENCES cart(id)
        ON DELETE CASCADE,
    receipt INTEGER,
        FOREIGN KEY (receipt) REFERENCES receipt(id)
        ON DELETE CASCADE
);

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Gary''s Tracks', 'some', 'Tracksuit', 'discrete units', 250)
ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('The Gopnik', 'some','Tracksuit', 'discrete units', 200)
ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Greta''s Runners', 'some','Shoes', 'discrete units',32)
ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Seeds of Doubt', 'some','Snacks', 'grams', 67)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('The Harevan', 'Your Harevan''s Favourite','Tracksuit', 'discrete units', 88)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('The Hopar', 'Your Hopar''s Favourite','Tracksuit', 'discrete units', 46)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Dad''s Slippers', 'Your dad has these','Shoes', 'discrete units', 120)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Lada Station Slippers', 'See these when you repair your car','Shoes', 'discrete units', 22)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Ararat Slippers', 'Meant to wear when climbing Ararat','Shoes', 'discrete units', 88)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO product_master (name, description, type, measurement_unit, price)
VALUES ('Tatik''s Pickled Everything', 'Your grandma has these always','Snacks', 'grams', 150)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO coupon_master (name, description, type, percentage_off)
VALUES ('20% Discount', 'Select this coupon to get a discount of 20%','Discount', 20)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO coupon_master (name, description, type, reward, reward_quantity, to_buy, buy_quantity)
VALUES ('Buy Seeds Get The Gopnik', 'Select this coupon get ''The Gopnik'' for free by purchasing 200 grams of Seeds of Doubt','Bogo', 'The Gopnik', 1, 'Seeds of Doubt', 200)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO coupon_master (name, description, type, reward, reward_quantity, to_buy, buy_quantity)
VALUES ('Buy Seeds Get The Gopnik', 'Select this coupon get ''The Gopnik'' for free by purchasing 200 grams of Seeds of Doubt','Bogo', 'The Gopnik', 1, 'Seeds of Doubt', 200)
    ON CONFLICT (name) DO NOTHING;