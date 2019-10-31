const Joi = require('joi');
const mongoose = require('mongoose');


const roomTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    },
    numberOfUnits: {
        type: Number,
        min: 0,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        default: 0
    }
});


// Adding an instance method -- to be available on an instance of Rental
roomTypeSchema.methods.increment = function(number) {
    this.numberOfUnits = Math.max(0, this.numberOfUnits + number);
};

const RoomType = mongoose.model('RoomType', roomTypeSchema);


function validateRoomType(roomType) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        numberOfUnits: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    };

    return Joi.validate(roomType, schema);

};


exports.RoomType = RoomType;
exports.validateRoomType = validateRoomType;
exports.roomTypeSchema = roomTypeSchema;
