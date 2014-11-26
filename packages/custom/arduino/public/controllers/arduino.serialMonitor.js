'use strict';

angular.module('mean.arduino').controller('ArduinoSerialMonitorController', ['$scope', 'Global', 'Arduino', 'MeanSocket', '$timeout',
    function ($scope, Global, Arduino, MeanSocket, $timeout) {

        console.log('test');

        $scope.items = [];
        $scope.glued = true;

        MeanSocket.on('arduino.data.receive', function(data){
            $scope.items.push({
                'date': Date.now(),
                'direction': 'from',
                'data': data
            });
        });
        MeanSocket.on('arduino.data.send', function(data){
            $scope.items.push({
                'date': Date.now(),
                'direction': 'to',
                'data': data
            });
        });
        //
        //function addItem() {
        //    $scope.items.push({
        //        'date': Date.now(),
        //        'direction': 'from',
        //        'data': Math.random()
        //    });
        //    $timeout(addItem, 1000);
        //}
        //
        //$timeout(addItem, 1000);
        //
        //function addItem2() {
        //    $scope.items.push({
        //        'date': Date.now(),
        //        'direction': 'to',
        //        'data': Math.random()
        //    });
        //    $timeout(addItem2, 5000);
        //}
        //
        //$timeout(addItem2, 5000);


    }]);
