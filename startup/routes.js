const express = require('express');
// const home = require('../routes/home');
const guests = require('../routes/guests');
const roomTypes = require('../routes/roomTypes');
const rooms = require('../routes/rooms');
// const users = require('../routes/users');
// const auth = require('../routes/auth');
// const error = require('../middleware/error');

module.exports = function (app) {
    
    app.set('view engine', 'pug');

    app.use(express.json());
    app.use('/api/guests', guests);
    app.use('/api/roomTypes', roomTypes);
    app.use('/api/rooms', rooms);
    // app.use('/api/users', users);
    // app.use('/api/auth', auth);
    // app.use('/', home);

    // app.use(error);
}