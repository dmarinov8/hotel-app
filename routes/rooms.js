const validate = require('../middleware/validate');
const { Room, validateRoom } = require('../models/room');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Room.find().sort('name'));
});


router.post('/', validate(validateRoom), async (req, res) => {
    // Validate the input
    const roomType = await RoomType.findOne({name: req.body.roomTypeName});
    if(!roomType) return res.status(400).send('Invalid room type.')

    let room = await Room.findOne({ roomCode: req.body.roomCode });
    if(room) return res.status(400).send('Room with this room code already exists.');

    room = new Room({ 
        roomCode: req.body.roomCode,
        roomName: req.body.roomName,
        roomType: {name: roomType.name},
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    room = await room.save();
    
    res.send(room);
});

