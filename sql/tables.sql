-- Table create scripts here
-- Table to store clients details
CREATE TABLE client(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    phone_number VARCHAR (15) NOT NULL
);

CREATE TABLE treatment(
    id SERIAL PRIMARY KEY, 
    type VARCHAR (50) NOT NULL,
    code VARCHAR (5) NOT NULL UNIQUE,
    price DECIMAL(10,2)
);

CREATE TABLE stylist(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    phone_number VARCHAR (15) NOT NULL,
    commission_percentage NUMERIC (3,2)
);

CREATE TABLE booking(
    id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    client_id INT REFERENCES client(id),
    treatment_id INT REFERENCES treatment(id),
    stylist_id INT REFERENCES stylist(id)
);