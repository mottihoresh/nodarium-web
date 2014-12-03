'use strict';

angular.module('mean.lights').config(['$stateProvider',
  function($stateProvider) {



      // Arduino Main Page
      var lights = {
          name: 'lights',  //mandatory
          templateUrl: 'lights/views/index.html',
          url: '/lights'
      };

      var lightsFixtures = {
          name: 'lights.fixtures', //mandatory. This counter-intuitive requirement addressed in issue #368
          parent: lights,  //mandatory
          url: '/fixtures',
          templateUrl: 'lights/views/lights.fixtures.html'
      };

      var newLightFixture = {
          name: 'lights.fixtures.new', //mandatory. This counter-intuitive requirement addressed in issue #368
          parent: lightsFixtures,  //mandatory
          url: '/fixtures/new',
          templateUrl: 'lights/views/lights.fixtures.new.html'
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
          .state(lightsFixtures)
          .state(newLightFixture)
          .state(lightsSchedule)
          .state(lightsDemo)
          .state(lightsSettings);

  }
]);
