const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var placeSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    photos:{
        type:[String],
    },
    description:{
        type:String,
        required:true,
    },
    perks:{
        type:[String],
    },
    extraInfo:{
        type:String,
    },
    checkIn: {
        type: String, 
        validate: {
            validator: function (value) {
                
                return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
            },
            message: props => `${props.value} is not a valid time format (HH:mm)`,
        },
    },
    checkOut: {
        type: String, 
        validate: {
            validator: function (value) {
                return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
            },
            message: props => `${props.value} is not a valid time format (HH:mm)`,
        },
    },
    maxGuests:{
        type:Number
    },
    price:{
        type:Number
    }
});

//Export the model
module.exports = mongoose.model('Place', placeSchema);