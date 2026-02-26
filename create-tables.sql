CREATE TABLE IF NOT EXISTS account(
    name VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS receipt(
    id SERIAL PRIMARY KEY,
    account VARCHAR(255),
        FOREIGN KEY (account) REFERENCES account(name)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS productMaster(
    name VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS product(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
        FOREIGN KEY (name) REFERENCES productMaster(name),
    quantity INTEGER NOT NULL,
    account VARCHAR(255),
        FOREIGN KEY (account) REFERENCES account(name) -- the account whose cart the product is in (if not purchased)
        ON DELETE CASCADE,
    receipt INTEGER,
        FOREIGN KEY (receipt) REFERENCES receipt(id)  -- the receipt where the product is in (if purchased)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS couponMaster(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amountOff INTEGER,
    reward VARCHAR(255),
        FOREIGN KEY (reward) REFERENCES productMaster(name)
        ON DELETE CASCADE,
    toBuy VARCHAR(255),
        FOREIGN KEY (toBuy) REFERENCES productMaster(name)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coupon(
    id SERIAL PRIMARY KEY,
    master_id INTEGER NOT NULL,
        FOREIGN KEY (master_id) REFERENCES couponMaster(id),
    account VARCHAR(255) NOT NULL,
        FOREIGN KEY (account) REFERENCES account(name)
);

INSERT INTO productMaster (name, description, type, price)
VALUES ('Gary''s Tracks', 'some', 'Tracksuit', 250)
ON CONFLICT (name) DO NOTHING;

INSERT INTO productMaster (name, description, type, price)
VALUES ('The Gopnik', 'some','Tracksuit', 200)
ON CONFLICT (name) DO NOTHING;

INSERT INTO productMaster (name, description, type, price)
VALUES ('Greta''s Runners', 'some','RunningShoes', 120)
ON CONFLICT (name) DO NOTHING;

INSERT INTO account (name, password)
VALUES ('Mister Dude', 'daddy chill')
ON CONFLICT (name) DO NOTHING;