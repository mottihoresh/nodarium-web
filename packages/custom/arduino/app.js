'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var events = require('events');
var eventEmitter = new events.EventEmitter();

var S = require('string');
var faker = require('faker');  // Used for testing

var serialport = require('serialport');

var moment = require('moment');

var Arduino = new Module('arduino');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Arduino.register(function (app, auth, database, socketio) {

    console.log('moment time: ',typeof(moment().subtract(10, 'days')));
    console.log('testing here..', moment().format());


    var SerialPort = serialport.SerialPort,
        serialPort = new SerialPort('/dev/cu.usbmodem1411', {
            baudrate: 57600,
            parser: serialport.parsers.readline('\n')
        }, false); // this is the openImmediately flag [default is true]

    var openSerialConnection = function () {

        console.log('Attempting to connect to Arduino');

        serialPort.open(function (err) {
            if (err) {
                console.log(err);
            }
        });
    };


    serialPort
        .on('connection', function () {
            console.log('connected');
        })
        .on('data', function (data) {
            console.log('incoming data: :', S(data).trim().s);
            console.log('data length: ', S(data).trim().s.length);
            console.log('------------------');
        })
        .on('error', function (error) {
            console.log('error: ', error);
        });


// testing
    setInterval(function () {
        serialPort.write(faker.finance.accountName() + '\n', function (err) {
            if (err) {
                eventEmitter.emit('test-event', err);
            }
        });
    }, 10000);

    eventEmitter.on('test-event', function (err) {
        openSerialConnection();
        console.log('trigger event', err);
    });



    Arduino.addTask = function () {
        console.log('task added!');
    };

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
        console.log(settings);
    });


    return Arduino;
});
