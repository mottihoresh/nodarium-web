'use strict';

angular.module('mean.lights').controller('LightsNewFixtureController', ['$scope', 'Global', 'Lights', 'MeanSocket',
    function ($scope, Global, Lights, MeanSocket) {
        $scope.global = Global;
        $scope.package = {
            name: 'lights'
        };

        $scope.newFixture = {
            type: {}
        };
    }
]);
