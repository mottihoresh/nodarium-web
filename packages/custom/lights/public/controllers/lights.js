'use strict';

angular.module('mean.lights').controller('LightsController', ['$scope', 'Global', 'Lights', 'MeanSocket',
  function($scope, Global, Lights, MeanSocket) {
    $scope.global = Global;
    $scope.package = {
      name: 'lights'
    };



      MeanSocket.on('connect', function(){
          console.log('test connection');

      });

      setInterval(function(){
          console.log('trying to send something back');
          MeanSocket.emit('test-light', {});
      }, 1000);
  }
]);
