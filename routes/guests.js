const validate = require('../middleware/validate');
const { Guest, validateGuest } = require('../models/guest');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send(await Guest.find().sort('name'));
});


module.exports = router;