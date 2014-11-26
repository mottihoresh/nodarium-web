'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Arduino = new Module('arduino');

var ArduinoCommandController = require('./server/controllers/arduinoCommandController');

var eventEmitter = require('meanio').events;

// Serialport modules
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;


/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Arduino.register(function (app, auth, database, socket) {

    Arduino.on = eventEmitter.on;
    Arduino.emit = eventEmitter.emit;
    Arduino.status = {
        'connected': false,
        'ready': false,
        'connectionAttempts': 0,
        'transmittingData': false
    };
    Arduino.Serial = null;

    Arduino.connect = function () {
        Arduino.Serial = new SerialPort('/dev/cu.usbmodem1411', {
            baudrate: 57600,
            disconnectedCallback: Arduino.reconnect,

            parser: serialport.parsers.readline('\n')
        }, false); // this is the openImmediately flag [default is true]

        Arduino.Serial
            .on('open', function (data) {
                Arduino.emit('arduino.connected');
            })

            .on('close', function () {
                Arduino.emit('arduino.disconnected');

                Arduino.status.connected = false;
                Arduino.status.ready = false;
                Arduino.status.transmittingData = false;

                // Even tho the connection is closed, we still need to fire
                // back the processTasks function, so we can check when
                // the connection is available agian so we can continue
                // sending data again.
                Arduino.processTasks();
            })

            .on('data', function (data) {
                Arduino.ProcessIncomingCommand(data);
                Arduino.emit('arduino.data.receive', data);
            })

            .on('error', function (err) {
                console.log('arduino error... not sure what to do now...', err);
            });

        // going to try to connect to arduino
        (function connectToArduino() {
            Arduino.status.connectionAttempts += 1;
            Arduino.emit('arduino.connecting');
            setTimeout(function () {
                Arduino.Serial.open(function (err) {
                    if (!err) {
                        Arduino.status.connected = true;
                        Arduino.status.connectionAttempts = 0;

                        // Once we have connection, we need to hand shake with the arduino
                        // handshake is done by sending data for the arduino, and waiting
                        // for it to come back in tact.

                        (function shakeHands() {
                            setTimeout(function () {
                                // Send handshake command type.

                                if (Arduino.status.connected && !Arduino.status.ready) {
                                    Arduino.sendData({'type': 'handshake'});
                                    shakeHands();
                                }
                            }, 1000);
                        })();

                    } else {
                        //console.log('unable to connect ', err);
                        connectToArduino();
                    }
                });
            }, 1000);
        })();

    };

    Arduino.reconnect = function () {

        Arduino.Serial.close(function () {
            Arduino.connect();
        });
    };

    Arduino.disconnect = function () {
    };

    Arduino.sendData = function (data, callback) {
        Arduino.emit('arduino.data.send', data);
        Arduino.Serial.write(JSON.stringify(data) + '\n', callback);
    };
    Arduino.ProcessIncomingCommand = function (data) {
        var command;
        try {
            command = JSON.parse(data);
        } catch (e) {
            console.log('Arduino: Unable to process incoming command', e, data);
            return;
        }

        if (command.status === 'OK' && command.type === 'handshake') {
            Arduino.emit('arduino.ready');
            Arduino.status.ready = true;

            // we are all set, connected and ready
            // lets start processing pending tasks.
            Arduino.processTasks();
            return;
        }
        // command recieved!!! yay!!!
        if (command.status === 'OK') {


            switch (command.type) {

                case 'confirm':
                    console.log('Confirmed recieved command');
                    Arduino.emit('arduino.tasks.completed');
                    ArduinoCommandController.mark_complete(command.id);
                    break;

                case 'light':
                    console.log('light command');
                    break;

                case 'pump':
                    console.log('pump command');
                    break;

                case 'sensor':
                    console.log('sensor command');
                    break;

                case 'outlet':
                    console.log('outlet command');
                    break;

            }

            // We've recieved some data that is not handshake, we can
            // process pending tasks.

        }

        else {
            console.log('Communication Error: ' + command.message);
        }

        Arduino.status.transmittingData = false;
        Arduino.processTasks();

    };

    Arduino.processTasks = function () {

        // If connected, ready, and not transmitting

        // If the arduino is busy, not connected or not ready, run callback.
        if (!Arduino.status.connected || !Arduino.status.ready ||
            Arduino.status.transmittingData) {

            // Setting a large timeout, equaling at least to the time it take
            // the arduino to connect.
            setTimeout(Arduino.processTasks, 1000);
            return;
        }

        // Arduino is ready to submit a command, if there is one pending.
        ArduinoCommandController.get_next(function (err, data) {

            // No available tasks... wait a little before trying again
            // or something went wrong with the quest...
            if (!data || err) {
                setTimeout(Arduino.processTasks, 1000);
                return;
            }

            // We are ready to send the data. need to setup a flag.
            Arduino.status.transmittingData = true;

            ArduinoCommandController.attempt(data._id,function(){
                Arduino.emit('arduino.tasks.attempted');
                Arduino.sendData({
                    'type': data.type,
                    'command': data.command,
                    'id': data._id
                });
            });

            //console.log(err,data);
        });


    };
    Arduino.addTask = function (type, command) {
        Arduino.emit('arduino.tasks.created');
        ArduinoCommandController.create_task({
            type: type,
            command: command

        });
    };

    (function createTask() {
        setTimeout(function () {
            Arduino.addTask('hippie', 'ho');
            createTask();
        }, Math.random() * 10000);
    })();


    //We enable routing. By default the Package Object is passed to the routes
    Arduino.routes(app, auth, database, socket.io);

    //We are adding a link to the main menu for all authenticated users
    // normal item
    Arduino.menus.add({
        title: 'Item1',
        link: 'settings item1',
        roles: ['anonymous', 'authenticated'],
        path: 'settings'
    });

    // sub menu wrapper
    Arduino.menus.add({
        title: 'item 2',
        link: 'settings item2',
        roles: ['authenticated'],
        path: 'settings'
    });

    // sub menu items
    Arduino.menus.add({
        title: 'Item 3 (sub menu Item)',
        link: 'settings item1',
        roles: ['anonymous', 'authenticated'],
        path: 'settings/settings item2'
    });

    Arduino.aggregateAsset('css', 'arduino.css');

    /**
     //Uncomment to use. Requires meanio@0.3.7 or above
     // Save settings with callback
     // Use this for saving data from administration pages
     Arduino.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

     // Get settings. Retrieves latest saved settigns
     Arduino.settings(function(err, settings) {
        //you now have the settings object
    });
     */

        // Another save settings example this time with no callback
        // This writes over the last settings.
    Arduino.settings({
        'anotherSettings': 'some value'
    });


    Arduino.settings(function (err, settings) {
        //you now have the settings object
    });


    Arduino.aggregateAsset('js', '../lib/angularjs-scroll-glue-Luegg/src/scrollglue.js', {
        absolute: false,
        global: true
    });

    Arduino.connect();

    return Arduino;
});
