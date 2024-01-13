const dotenv = require('dotenv');
dotenv.config();
// const Request = require('../models/Request');
const User = require('../models/User');

const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/asyncWrapper')
const bcrypt = require('bcryptjs');

// const { createCustomError } = require('../errors/custom-error')

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const getAllUsers = asyncWrapper(async (req, res) => {

    const users = await User.find({});
    res.status(200).json({ status: 'success', data: { users, nbHits: users.length } })

})


const registerUser = asyncWrapper(async (req, res) => {


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
    // res.status(201).json({ message: 'User registered successfully', token });
    res.status(201).json({ newUser })

}
)

const loginUser = asyncWrapper(async (req, res, next) => {

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

}
)
const getUser = asyncWrapper(async (req, res, next) => {

    const { id: userID } = req.params
    const user = await User.findOne({ _id: userID })
    if (!user) {
        // return next(createCustomError(`No task found with id ${userID}`, 404))
        res.json({ message: `No task found with id ${userID}` })
    }
    res.status(201).json({ user })

})

const updateUser = asyncWrapper(async (req, res) => {

    const { id: userID } = req.params
    const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
        new: true,
        runValidators: true
    })
    if (!user) {
        // return next(createCustomError(`No task found with id ${userID}`, 404))
        res.json({ message: `No user found with id ${userID}` })

    }
    res.status(201).json({ user })

})



const deleteUser = asyncWrapper(async (req, res) => {

    const { id: taskID } = req.params
    const user = await User.findOneAndDelete({ _id: userID })
    if (!user) {
        return next(createCustomError(`No task found with id ${userID}`, 404))
    }
    res.status(201).json({ user })

})

// const editUser = asyncWrapper(async (req, res) => {

//     const { id: userID } = req.params
//     const user = await Task.findOneAndUpdate({ _id: userID }, req.body, {
//         new: true,
//         runValidators: true,
//         overwrite: true
//     })
//     if (!user) {
//         return res.status(404).json({ msg: `No user found with id ${userID}` })
//     }
//     res.status(201).json({ user })
// }
// )

module.exports = {
    getAllUsers, registerUser, loginUser, getUser, updateUser, deleteUser
}
