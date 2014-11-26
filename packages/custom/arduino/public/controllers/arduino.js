'use strict';

angular.module('mean.arduino').controller('ArduinoController', ['$scope', 'Global', 'Arduino', 'MeanSocket',
    function ($scope, Global, Arduino, MeanSocket) {
        $scope.global = Global;
        $scope.package = {
            name: 'arduino'
        };

        $scope.status = '';
        $scope.pendingTasks = [];
        $scope.arduinoStatus = {};

        Arduino.status(function (data) {
            if (data.success === true) {
                $scope.status = data.status;
            } else {
                $scope.status = 'Disconnected';
            }
        });

        Arduino.getPendingTasks(function (data) {
            if (data.success) {

                $scope.pendingTasks = data.tasks;

            } else {
                console.log('no');
            }
        });


        MeanSocket.on('arduino.connecting', function () {
            $scope.status = 'Trying to Connect';

        });

        MeanSocket.on('arduino.connecting', function (status) {
            $scope.arduinoStatus = status;
        });

        MeanSocket.on('arduino.connected', function (status) {
            $scope.status = 'Connected - Waiting for Handshake';
            $scope.arduinoStatus = status;
        });
        MeanSocket.on('arduino.ready', function (status) {
            $scope.status = 'Ready';

            $scope.arduinoStatus = status;
        });
        MeanSocket.on('arduino.disconnected', function (status) {
            $scope.status = 'Disconnected';
            $scope.arduinoStatus = status;
        });

        MeanSocket.on('arduino.tasks.created', function () {
            Arduino.getPendingTasks(function (data) {
                if (data.success) {

                    $scope.pendingTasks = data.tasks;

                }
            });
        });


        MeanSocket.on('arduino.tasks.attempted', function () {
            console.log('arduino.tasks.attempted');
            Arduino.getPendingTasks(function (data) {
                if (data.success) {

                    $scope.pendingTasks = data.tasks;

                }
            });
        });
        MeanSocket.on('arduino.tasks.completed', function () {
            console.log('arduino.tasks.completed');
            Arduino.getPendingTasks(function (data) {
                if (data.success) {

                    $scope.pendingTasks = data.tasks;

                }
            });
        });


        $scope.port = '/dev/cb.bu.arduino1234';

    }
]);
