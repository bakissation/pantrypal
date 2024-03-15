const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const uuid = require('uuid');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 3000;

// Sequelize connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// User model
const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sessionToken: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

// Connect to the database
sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

// Middleware to parse body
app.use(bodyParser.json());

// CORS middleware
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*'
}));

// Registration event
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Hashing the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Saving the user in the database
        User.create({ email, password: hashedPassword })
            .then(() => {
                console.log('Registration successful');
                res.sendStatus(200);
            })
            .catch((err) => {
                console.error('Error saving user in database:', err);
                res.status(500).send('Internal Server Error');
            });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Fetch user from the database
    User.findOne({ where: { email } })
        .then((user) => {
            if (!user) {
                res.status(401).send('Invalid email or password');
                return;
            }

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
                user.update({ sessionToken })
                    .then(() => {
                        res.status(200).json({ sessionToken });
                    })
                    .catch((err) => {
                        console.error('Error saving session token in database:', err);
                        res.status(500).send('Internal Server Error');
                    });
            });
        })
        .catch((err) => {
            console.error('Error fetching user from database:', err);
            res.status(500).send('Internal Server Error');
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