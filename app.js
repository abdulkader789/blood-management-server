const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const connectDB = require('./db/connect');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cors = require('cors');


app.use(express.json());
app.use(cors());


const BloodDonation = require('./models/BloodDonation');
const User = require('./models/User');

dotenv.config();

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: '1h' });
};



// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all blood donations
app.get('/allbloodgroup', async (req, res) => {
    try {
        const bloodDonations = await BloodDonation.find();
        res.status(200).json(bloodDonations);
    } catch (error) {
        console.error('Error getting blood donations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token and send it in the response
        const token = generateToken(newUser);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token and send it in the response
        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', userId: user._id, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Blood donation route
app.post('/donateblood', async (req, res) => {
    try {
        const { userId, bloodGroup, location, isActive } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a new blood donation record
        const newDonation = new BloodDonation({
            user: userId,
            bloodGroup,
            location,
            isActive
        });
        await newDonation.save();

        res.status(201).json({ message: 'Blood donation recorded successfully' });
    } catch (error) {
        console.error('Error recording blood donation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();
