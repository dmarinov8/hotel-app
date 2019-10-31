const validate = require('../middleware/validate');
const { RoomType, validateRoomType } = require('../models/roomType');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await RoomType.find().sort('name'));
});


router.post('/', validate(validateRoomType), async (req, res) => {

    let roomType = new RoomType({ 
        name: req.body.name
    });
    roomType = await roomType.save();
    
    res.send(roomType);
});

