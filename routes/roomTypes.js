const validate = require('../middleware/validate');
const { RoomType, validateRoomType } = require('../models/roomType');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await RoomType.find().sort('name'));
});


router.post('/', validate(validateRoomType), async (req, res) => {
    let roomType = await RoomType.findOne({ name: req.body.name });
    if(roomType) return res.status(400).send('This room type already exists.');

    roomType = new RoomType({ 
        name: req.body.name,
        dailyRentalRate: req.body.dailyRentalRate
    });
    roomType = await roomType.save();
    
    res.send(roomType);
});

module.exports = router;
