'use strict';

var arduinoCommands = require('../controllers/arduinoCommandController');

// The Package is past automatically as first parameter
module.exports = function (Arduino, app, auth, database) {

    app.get('/arduino/example/anyone', arduinoCommands.create);
    app.get('/arduino/next_command', arduinoCommands.getNext);


    app.get('/arduino/example/auth', auth.requiresLogin, function (req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/arduino/example/admin', auth.requiresAdmin, function (req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/arduino/example/render', auth.requiresLogin, function (req, res, next) {
        Arduino.render('index', {
            package: 'arduino'
        }, function (err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
