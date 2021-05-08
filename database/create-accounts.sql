CREATE TYPE roletype AS ENUM ('staff', 'student');

CREATE TABLE accounts (
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    password BINARY(60) NOT NULL,
    role roletype NOT NULL
);