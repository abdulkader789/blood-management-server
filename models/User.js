const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    fullName: String,
    phone: String,
    presentAddress: String,
    availableLocationsToDonate: [String], // Assuming an array of strings for locations
    age: Number,
    lastDonated: Date,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
