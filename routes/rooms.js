const validate = require('../middleware/validate');
const { Room, validateRoom } = require('../models/room');
const { RoomType } = require('../models/roomtype');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Room.find().populate('roomType','name -_id').sort('roomCode'));
});


router.post('/', validate(validateRoom), async (req, res) => {
    // Validate the input
    const roomType = await RoomType.findById(req.body.roomTypeId);
    if(!roomType) return res.status(400).send('Invalid room type.')

    let room = await Room.findOne({ roomCode: req.body.roomCode });
    if(room) return res.status(400).send('Room with this room code already exists.');

    room = new Room({ 
        roomCode: req.body.roomCode,
        roomName: req.body.roomName,
        roomType: req.body.roomTypeId
    });
    room = await room.save();

    roomType.increment(1);
    await roomType.save();
    
    const roomInDb = await Room
        .findById(room._id)
        .populate('roomType', 'name numberOfUnits -_id')
        .select('roomCode roomName roomType');

    res.send(roomInDb);
});

module.exports = router;