const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const bookingSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place', 
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    numofguest: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
    },
});

// Export the model
module.exports = mongoose.model('Booking', bookingSchema);
