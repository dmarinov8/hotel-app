const Joi = require('joi');
const mongoose = require('mongoose');


const roomTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const roomType = mongoose.model('roomType', roomTypeSchema);


function validateRoomType(roomType) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(roomType, schema);

}


exports.RoomType = RoomType;
exports.validateRoomType = validateRoomType;
exports.roomTypeSchema = roomTypeSchema;
