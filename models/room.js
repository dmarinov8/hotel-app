const Joi = require('joi');
const mongoose = require('mongoose');
// const {RoomType, roomTypeSchema} = require('./roomType')


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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        required: true
    }
});

const Room = mongoose.model('Room', roomSchema);


function validateRoom(room) {
    const schema = {
        roomCode: Joi.string().min(1).max(10).required(),
        roomName: Joi.string().min(5).max(255).required(),
        roomType: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(room, schema);

}

exports.roomSchema = roomSchema;
exports.Room = Room;
exports.validateRoom = validateRoom;
