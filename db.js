const mysql = require('mysql');

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server.');
    createDatabase();
});

function createDatabase() {
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    db.query(createDatabaseQuery, (err) => {
        if (err) throw err;
        console.log('Database created.');
        useDatabase();
    });
}

function useDatabase() {
    const useDatabaseQuery = `USE ${process.env.DB_NAME}`;
    db.query(useDatabaseQuery, (err) => {
        if (err) throw err;
        console.log('Using database.');
        createTables();
    });
}

function createTables() {
    const createTablesQuery = [
        `CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS fridges (
            fridge_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`,
        `CREATE TABLE IF NOT EXISTS ingredients (
            ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS fridge_ingredients (
            fridge_id INT,
            ingredient_id INT,
            quantity INT NOT NULL,
            FOREIGN KEY (fridge_id) REFERENCES fridges(fridge_id),
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
        )`
    ];

    createTablesQuery.forEach(query => {
        db.query(query, (err) => {
            if (err) throw err;
        });
    });

    console.log('Tables created.');
    db.end();
}