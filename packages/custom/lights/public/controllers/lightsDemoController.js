'use strict';

angular.module('mean.lights').controller('LightsDemoController', ['$scope', 'Global', 'Lights', 'MeanSocket',
  function($scope, Global, Lights, MeanSocket) {
    $scope.global = Global;
    $scope.package = {
      name: 'lights'
    };


      $scope.country = {};
      $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
          {name: 'Afghanistan', code: 'AF'},
          {name: 'Åland Islands', code: 'AX'},
          {name: 'Albania', code: 'AL'}
      ];


  }
]);
