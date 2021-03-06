'use strict';

var arduinoCommands = require('../controllers/arduinoCommandController');

// The Package is past automatically as first parameter
module.exports = function (Arduino, app, auth, database, io) {

    Arduino

        // Basic Connectivity
        .on('arduino.disconnected', function () {
            io.sockets.emit('arduino.disconnected', Arduino.status);
        })
        .on('arduino.connecting', function () {
            io.sockets.emit('arduino.connecting', Arduino.status);
        })
        .on('arduino.connected', function () {
            io.sockets.emit('arduino.connected', Arduino.status);
        })
        .on('arduino.ready', function () {
            io.sockets.emit('arduino.ready', Arduino.status);
        })


        // Tasks
        .on('arduino.tasks.created', function () {
            io.sockets.emit('arduino.tasks.created');
        })
        .on('arduino.tasks.attempted', function () {
            io.sockets.emit('arduino.tasks.attempted');
        })
        .on('arduino.tasks.completed', function () {
            io.sockets.emit('arduino.tasks.completed');
        })

        // Data Events
        .on('arduino.data.receive', function (data) {
            io.sockets.emit('arduino.data.receive', data);
        })
        .on('arduino.data.send', function (data) {
            io.sockets.emit('arduino.data.send', data);
        });


    app.get('/arduino/status', auth.requiresAdmin, function (req, res, next) {
        res.send(Arduino.status.connected);
    });

    app.get('/arduino/tasks', auth.requiresAdmin, arduinoCommands.pendingTasks);

    app.get('/arduino/example/anyone', arduinoCommands.create);
    app.get('/arduino/next_command', arduinoCommands.getNext);
    app.get('/arduino/clear_expired', arduinoCommands.clear_expired);


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
