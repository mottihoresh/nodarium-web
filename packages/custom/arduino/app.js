'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var events = require('events');
var eventEmitter = new events.EventEmitter();


//var S = require('string');
var faker = require('faker');  // Used for testing

var serialport = require('serialport');

var Arduino = new Module('arduino');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Arduino.register(function (app, auth, database, socketio) {

    // get arduino command controller
    var ArduinoCommandController = require('./server/controllers/arduinoCommandController');


    Arduino.connected = false;
    Arduino.transmiting = false;

    // Setup serial connection, but don't open it yet.
    var SerialPort = serialport.SerialPort,
        serialPort = new SerialPort('/dev/cu.usbmodem1411', {
            baudrate: 57600,
            parser: serialport.parsers.readline('\n')
        }, false); // this is the openImmediately flag [default is true]


    // private function that attempts to connect to the defined serial
    // connection.
    var openSerialConnection = function () {

        console.log('Attempting to connect to Arduino');

        serialPort.open(function (err) {
            if (!err) {

                console.log('connected to Arduino controller');

            }

        });
    };


    eventEmitter.on('test-event', function (err) {
        if (!Arduino.connected) {
            openSerialConnection();
        } else {
            console.log('This console log should never fire..., if it does it means there are zombies walking around the streets of Washington D.C.');
        }


    });


    Arduino.addTask = function (type, command) {
        ArduinoCommandController.create_task({
            type: type,
            command: command

        });
    };

    setInterval(function () {
        Arduino.addTask(faker.name.firstName() + ' ' + faker.name.lastName(), faker.hacker.phrase());
    }, 15000);

    setInterval(function(){
        ArduinoCommandController.clear_expired(null,null,function(data){
            console.log('cleared data: ',data);
        });
    }, 60000);

    var processCommandsQue = function () {
        setTimeout(function () {

            // ust be connected in order to process que.
            if (Arduino.connected && !Arduino.transmiting) {
                // get next request
                var next_command;
                ArduinoCommandController.get_next(function (err, data) {
                    next_command = data;
                    if (data && data._id) {
                        // increase attempts count
                        ArduinoCommandController.attempt(next_command._id, function (err, data) {
                            if (data && data.attempts > 20) {
                                // if there are more then 20 attempts, break.
                                console.log('!!!!!!!!!!!!!!FAIL!!!!!!!!!!!!!!!!!!!!!!');
                                ArduinoCommandController.mark_complete(next_command._id, function () {
                                });
                            }
                        });

                        // send to arduino
                        var command_obj = {
                            type: data.type,
                            command: data.command,
                            id: data._id,
                        };

                        Arduino.transmiting = true;

                        serialPort.write(JSON.stringify(command_obj) + '\n', function (err) {
                            serialPort.drain(function (err) {
                                if (err) {
                                    eventEmitter.emit('test-event', err);
                                }

                            });

                        });

                    }

                });
            } else {
                processCommandsQue();
            }


        }, 1);
    };

    var initializeSerialPortEventListeners = function () {
        // need to refactor and move to routes file.
        serialPort
            .on('open', function () {
                eventEmitter.emit('arduino.connected');
                console.log('connected, connection opened!');
            })
            .on('data', function (data, err) {


                ArduinoCommandController.process_command(data, function () {
                    Arduino.transmiting = false;
                    processCommandsQue();
                });
            })
            .on('error', function (error) {
                console.log('error: ', error);

            })
            .on('close', function (error) {
                console.log('connection closed');

                eventEmitter.emit('arduino.disconnected');

                (function connectToArduino() {

                    setTimeout(function () {

                        connectToArduino();

                        if (!Arduino.connected) {
                            openSerialConnection();
                        }

                    }, 1000);
                })();

            });

    };

    eventEmitter.on('arduino.disconnected', function () {
        Arduino.connected = false;
        Arduino.transmiting = false;
        setTimeout(initializeSerialPortEventListeners, 100);
        console.log('connection lost, trying to re-set serial port listeners');
    })
        .on('arduino.connected', function () {

            serialPort.flush(function () {
                serialPort.drain(function () {

                    setTimeout(function(){
                        Arduino.connected = true;
                    },1000);

                });
            });


        });

    initializeSerialPortEventListeners();
    (function connectToArduino() {

        setTimeout(function () {


            if (!Arduino.connected) {
                openSerialConnection();
                connectToArduino();
            }

        }, 5000);
    })();




    //We enable routing. By default the Package Object is passed to the routes
    Arduino.routes(app, auth, database);

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

    processCommandsQue();
    return Arduino;
});
