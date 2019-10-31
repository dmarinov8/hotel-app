const Joi = require('joi');
const mongoose = require('mongoose');
const {roomTypeSchema} = require('./roomType')


const roomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1,
        maxlength: 10
    },
    roomName: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    roomType: {
        type: roomTypeSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 100,
        default: 1
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
});

const Room = mongoose.model('Room', roomSchema);


function validateRoom(room) {
    const schema = {
        roomCode: Joi.string().min(1).max(10).required(),
        roomName: Joi.string().min(5).max(255).required(),
        roomTypeName: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).max(100),
        dailyRentalRate: Joi.number().min(0).max(100)
    };

    return Joi.validate(room, schema);

}

exports.roomSchema = roomSchema;
exports.Room = Room;
exports.validateRoom = validateRoom;
