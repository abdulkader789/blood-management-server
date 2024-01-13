const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    fullName: String,
    bloodGroup: String,
    phone: String,
    presentAddress: String,
    age: Number,
    isActive: Boolean,
    lastDonated: Date,
    donateAreas: [String]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
