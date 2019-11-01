const mongoose = require('mongoose');
const Joi = require('joi');


const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 50
    },
    country: {
        type: String,
        minlength: 5,
        maxlength: 50
    }
});


const Guest = mongoose.model('Guest', guestSchema);

function validateGuest(guest) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50),
        country: Joi.string().min(5).max(50)
    };

    return Joi.validate(guest, schema);

}


exports.guestSchema = guestSchema;
exports.Guest = Guest;
exports.validateGuest = validateGuest;

