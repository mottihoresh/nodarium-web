'use strict';

angular.module('mean.arduino').factory('Arduino', ['$http',
    function ($http) {

        var arduinoStatus = function (callback) {
            $http.get('arduino/status')
                .success(function (data, status, header, config) {
                    callback({
                        success: true,
                        status: data === true ? 'Connected' : 'Disconnected'
                    });
                });
        };

        var getPendingTasks = function(callback) {
          $http.get('arduino/tasks')
              .success(function (data, status, header, config) {
                  callback({
                      success: true,
                      tasks: data
                  });
              });
        };


        return {
            name: 'arduino',
            status: arduinoStatus,
            getPendingTasks: getPendingTasks
        };
    }
]);
