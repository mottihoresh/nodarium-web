'use strict';

angular.module('mean.arduino').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // Arduino Main Page
        var arduino = {
            name: 'arduino',  //mandatory
            templateUrl: 'arduino/views/index.html',
            url: '/arduino'
        };

        var arduinoHistory = {
            name: 'arduino.history', //mandatory. This counter-intuitive requirement addressed in issue #368
            parent: arduino,  //mandatory
            url: '/history',
            templateUrl: 'arduino/views/arduino.history.html'
        };

        var arduinoSerialMonitor = {
            name: 'arduino.serialMonitor', //mandatory. This counter-intuitive requirement addressed in issue #368
            parent: arduino,  //mandatory
            url: '/serial-monitor',
            templateUrl: 'arduino/views/arduino.serialMonitor.html'
        };

        var arduinoSettings = {
            name: 'arduino.settings', //mandatory. This counter-intuitive requirement addressed in issue #368
            parent: arduino, //mandatory
            url: '/settings',
            templateUrl: 'arduino/views/arduino.settings.html'
        };

        $stateProvider
            .state(arduino)
            .state(arduinoHistory)
            .state(arduinoSerialMonitor)
            .state(arduinoSettings);

    }
]);
