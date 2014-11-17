'use strict';

angular.module('mean.arduino').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('arduino settings page', {
                url: '/admin/settings/arduino',
                templateUrl: 'arduino/views/index.html'
            })

            .state('arduino example page', {
                url: '/arduino/example',
                templateUrl: 'arduino/views/index.html'
            });
    }
]);
