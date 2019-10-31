const express = require('express');
// const home = require('../routes/home');
const guests = require('../routes/guests');
const roomtypes = require('../routes/roomtypes');
const rooms = require('../routes/rooms');
// const users = require('../routes/users');
// const auth = require('../routes/auth');
// const error = require('../middleware/error');

module.exports = function (app) {
    
    app.set('view engine', 'pug');

    app.use(express.json());
    app.use('/api/roomtypes', roomtypes);
    app.use('/api/rooms', rooms);
    // app.use('/api/users', users);
    // app.use('/api/auth', auth);
    // app.use('/', home);

    // app.use(error);
}