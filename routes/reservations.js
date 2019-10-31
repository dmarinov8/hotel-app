const validate = require('../middleware/validate');
const { Reservation, validateReservation } = require('../models/reservation');
const { Room } = require('../models/room');
const { validateGuest } = require('../models/guest');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Reservation
        .find()
        .populate('room','roomCode roomName roomType.name -_id')
        .sort('roomCode')
    );
});


router.post('/', validate(validateReservation), async (req, res) => {
    // Validate the input
    const room = await Room.findById(req.body.roomId);
    if(!room) return res.status(400).send('Invalid room.')

    // Validate guest info
    const { error } = validateGuest({
        name: req.body.guestName,
        email: req.body.guestEmail,
        phone: req.body.guestPhone,
        country: req.body.guestCountry        
    }); // { error } === result.error
    if(error) return res.status(400).send(error.details[0].message);

    // Validate Check In/Out dates
    if(req.body.checkOutDate <= req.body.checkInDate) return res.status(400).send('Check out needs to be later than check in.')

    let reservation = new Reservation({ 
        guest: {
            name: req.body.guestName,
            email: req.body.guestEmail,
            phone: req.body.guestPhone,
            country: req.body.guestCountry        
        },
        room: req.body.roomId,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        numberAdults: req.body.numberAdults,
        numberKids: req.body.numberKids,
        notes: req.body.notes
    });
    reservation = await reservation.save();

    const reservationInDb = await Reservation
        .findById(reservation._id)
        .populate('room', 'roomCode roomName roomType.name -_id')

    res.send(reservationInDb);
});

module.exports = router;
