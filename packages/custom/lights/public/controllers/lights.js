'use strict';

angular.module('mean.lights').controller('LightsController', ['$scope', 'Global', 'Lights', 'MeanSocket',
  function($scope, Global, Lights, MeanSocket) {
    $scope.global = Global;
    $scope.package = {
      name: 'lights'
    };


      $scope.slider = {
          'options': {


              orientation: 'vertical', range: 'min',
              start: function (event, ui) {
                  console.info('Slider start');
              },
              stop: function (event, ui) {
                  console.info('Slider stop');
              }
          }
      };


      console.log('Lights Controller');
      //MeanSocket.on('connect', function(){
      //    console.log('test connection');
      //
      //});
      //
      //setInterval(function(){
      //    console.log('trying to send something back');
      //    MeanSocket.emit('test-light', {});
      //}, 1000);
  }
]);
