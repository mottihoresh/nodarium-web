'use strict';

angular.module('mean.lights').config(['$stateProvider',
  function($stateProvider) {



      // Arduino Main Page
      var lights = {
          name: 'lights',  //mandatory
          templateUrl: 'lights/views/index.html',
          url: '/lights'
      };

      var lightsTanks = {
          name: 'lights.tanks', //mandatory. This counter-intuitive requirement addressed in issue #368
          parent: lights,  //mandatory
          url: '/tanks',
          templateUrl: 'arduino/views/arduino.history.html'
      };

      var lightsSchedule = {
          name: 'lights.schedule', //mandatory. This counter-intuitive requirement addressed in issue #368
          parent: lights,  //mandatory
          url: '/schedule',
          templateUrl: 'arduino/views/arduino.serialMonitor.html'
      };

      var lightsDemo = {
          name: 'lights.demo', //mandatory. This counter-intuitive requirement addressed in issue #368
          parent: lights, //mandatory
          url: '/demo',
          templateUrl: 'lights/views/lights.demo.html'
      };

      var lightsSettings = {
          name: 'lights.settings', //mandatory. This counter-intuitive requirement addressed in issue #368
          parent: lights, //mandatory
          url: '/settings',
          templateUrl: 'arduino/views/arduino.settings.html'
      };

      $stateProvider
          .state(lights)
          .state(lightsTanks)
          .state(lightsSchedule)
          .state(lightsDemo)
          .state(lightsSettings);

  }
]);
