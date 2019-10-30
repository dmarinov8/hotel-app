const validate = require('../middleware/validate');
const { Guest, validateGuest } = require('../models/guest');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Guest.find().sort('name'));
});


router.post('/', validate(validateGuest), async (req, res) => {

    let guest = new Guest({ 
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.country
    });
    guest = await guest.save();
    
    res.send(guest);
});

