// Importing required modules
const express = require('express');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const uuid = require('uuid');
const cors = require('cors');

// Loading environment variables
require('dotenv').config();

// Creating an Express app
const app = express();
const port = 3000;

// Setting up Sequelize connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Defining User model
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

// Connecting to the database
sequelize.authenticate()
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.error('Error connecting to the database:', err));

// Using express.json middleware to parse JSON bodies
app.use(express.json());

// Using CORS middleware with environment variables
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || '*',
    allowedHeaders: process.env.CORS_HEADERS || '*'
}));

// Registration route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Checking if the email already exists in the database
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).send('Email already exists');
            return;
        }

        // Hashing the password synchronously
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Saving the user in the database
        await User.create({ email, password: hashedPassword });
        console.log('Registration successful');
        res.sendStatus(200);
    } catch (err) {
        console.error('Error saving user in database:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetching user from the database
        const user = await User.findOne({ where: { email } });

        // If user doesn't exist or password doesn't match, send 401 status
        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).send('Invalid email or password');
            return;
        }

        // Generating session token
        const sessionToken = uuid.v4();

        // Saving session token in the database
        await user.update({ sessionToken });

        res.status(200).json({ sessionToken });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});