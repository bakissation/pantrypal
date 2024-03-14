const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const uuid = require('uuid');
require('dotenv').config();


const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to parse request body
app.use(bodyParser.json());

// Registration event
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    // Hashing the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Saving the user in the database
        const user = { email, password: hashedPassword };
        connection.query('INSERT INTO users SET ?', user, (err) => {
            if (err) {
                console.error('Error saving user in database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log('Registration successful');
            res.sendStatus(200);
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Fetch user from the database
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
        if (err) {
            console.error('Error fetching user from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(401).send('Invalid email or password');
            return;
        }
        const user = results[0];
        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (!isMatch) {
                res.status(401).send('Invalid email or password');
                return;
            }
            // Generate session token
            const sessionToken = generateSessionToken();
            // Save session token in the database
            connection.query('UPDATE users SET sessionToken = ? WHERE id = ?', [sessionToken, user.id], (err) => {
                if (err) {
                    console.error('Error saving session token in database:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.status(200).json({ sessionToken });
            });
        });
    });
});

function generateSessionToken() {
    const sessionToken = uuid.v4();
    return sessionToken;
}







// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});