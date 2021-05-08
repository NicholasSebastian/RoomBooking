CREATE TABLE rooms (
    name VARCHAR(50) NOT NULL PRIMARY KEY,
    timeFrom TIMESTAMP NOT NULL,
    timeTo TIMESTAMP NOT NULL,
    capacity INT NOT NULL,
    host VARCHAR(50) NOT NULL REFERENCES accounts(username),
    price REAL NOT NULL,
    active BOOLEAN NOT NULL,
    promocode VARCHAR(10)
);