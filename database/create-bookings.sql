CREATE TABLE bookings (
    bookingId VARCHAR(36) NOT NULL PRIMARY KEY,
    roomName VARCHAR(50) NOT NULL REFERENCES rooms(name),
    booker VARCHAR(50) NOT NULL REFERENCES accounts(username),
    price REAL NOT NULL,
    purchaseDate TIMESTAMP NOT NULL
);