const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL server.');
        await createDatabase();
        await sequelize.close();
    } catch (err) {
        console.error('Error connecting to MySQL server:', err);
    }
}

async function createDatabase() {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log('Database created.');
        await useDatabase();
    } catch (err) {
        console.error('Error creating database:', err);
    }
}

async function useDatabase() {
    try {
        await sequelize.query(`USE ${process.env.DB_NAME}`);
        console.log('Using database.');
        await createTables();
    } catch (err) {
        console.error('Error using database:', err);
    }
}

async function createTables() {
    try {
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS users (
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                sessionToken VARCHAR(255)
            )
        `);
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS fridges (
                fridge_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        `);
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS ingredients (
                ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS fridge_ingredients (
                fridge_id INT,
                ingredient_id INT,
                quantity INT NOT NULL,
                FOREIGN KEY (fridge_id) REFERENCES fridges(fridge_id),
                FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
            )
        `);
        console.log('Tables created.');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

connectToDatabase();
