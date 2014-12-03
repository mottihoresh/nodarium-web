'use strict';

angular.module('mean.lights').controller('LightsFixturesController', ['$scope', 'Global', 'Lights', 'MeanSocket',
    function ($scope, Global, Lights, MeanSocket) {
        $scope.global = Global;
        $scope.package = {
            name: 'lights'
        };


        // Need to write a function that get available fixtures.
        // but for the mean time lets just manually pull them.
        $scope.fixtureTypes = [
            {
                name: 'Radion 3rd Gen Pack',
                desc: '6 Channels',
                channels: [
                    {name: 'Cool White', code: 'W'},
                    {name: 'Deep Blue', code: 'RB'},
                    {name: 'Blue', code: 'B'},
                    {name: 'Green', code: 'G'},
                    {name: 'Red', code: 'R'},
                    {name: 'Indigo and Violets', code: 'UV'}
                ]
            },

            {
                name: 'Lumia 5.1',
                desc: '5 Channels',
                channels: [
                    {name: 'Natural White', code: 'W'},
                    {name: 'Royal Blue', code: 'RB'},
                    {name: 'Hyper Violet', code: 'UV'},
                    {name: 'Deep Red', code: 'R'},
                    {name: 'True Violet / Cool Blue', code: 'RB'}
                ]
            },

            {
                name: 'Lumia 5.2',
                desc: '5 Channels',
                channels: [
                    {name: 'Hyper Violet / True Violet', code: 'UV'},
                    {name: 'Royal Blue', code: 'RB'},
                    {name: 'Natural White / Warm White', code: 'W'},
                    {name: 'Turquoise', code: 'B'},
                    {name: 'Hyper Violet / Royal Blue', code: 'RB'}
                ]
            }

        ];


    }
]);
