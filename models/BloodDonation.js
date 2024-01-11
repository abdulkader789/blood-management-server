const mongoose = require('mongoose');

const BloodDonationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false, // Set default value to false if not provided
    },
}, { timestamps: true });

const BloodDonation = mongoose.model('BloodDonation', BloodDonationSchema);

module.exports = BloodDonation;
