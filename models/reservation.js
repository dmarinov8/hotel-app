const Joi = require('joi');
const mongoose = require('mongoose');
const { guestSchema } = require('./guest');


const reservationSchema = new mongoose.Schema({
    guest: guestSchema,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    checkInDate: { 
        type: Date,
        required: true,
        default: new Date()
    },
    checkOutDate: {  
        type: Date,
        required: true
    },
    numberAdults: {
        type: Number,
        min: 1,
        required: true
    },
    numberKids: Number,
    notes: {
        type: String,
        maxlength: 255
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);


function validateReservation(reservation) {
    const schema = {
        guestName: Joi.string().min(5).max(50).required(),
        guestEmail: Joi.string().min(5).max(50).required(),
        guestPhone: Joi.string().min(5).max(50),
        guestCountry: Joi.string().min(5).max(50),
        roomId: Joi.ObjectId().required(),
        checkInDate: Joi.date().required(),
        checkOutDate: Joi.date().required(),
        numberAdults: Joi.number().min(1).required(),
        numberKids: Joi.number(),
        notes: Joi.string().max(255)
    };

    return Joi.validate(reservation, schema);

}

exports.reservationSchema = reservationSchema;
exports.Reservation = Reservation;
exports.validateReservation = validateReservation;
