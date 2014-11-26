'use strict';

// The Package is past automatically as first parameter
module.exports = function (Lights, app, auth, database, Arduino, io) {

    io.on('connection', function (socket) {
        socket.on('test-light', function () {
            console.log('test from lights');
        });

    });

    app.get('/lights/example/anyone', function (req, res, next) {
        Arduino.addTask();
        res.send('Anyone can access this');
    });

    app.get('/lights/example/auth', auth.requiresLogin, function (req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/lights/example/admin', auth.requiresAdmin, function (req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/lights/example/render', function (req, res, next) {
        Lights.render('index', {
            package: 'lights'
        }, function (err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
