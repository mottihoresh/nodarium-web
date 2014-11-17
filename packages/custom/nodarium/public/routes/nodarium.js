'use strict';

angular.module('mean.nodarium').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider

            .state('settings item1', {
                url: '/settings/item1',
                templateUrl: 'nodarium/views/index.html'
            })

            .state('settings item2', {
                url: '/settings/item2',
                templateUrl: 'nodarium/views/index.html'
            })


            .state('settings item3', {
                url: '/settings/item3',
                templateUrl: 'nodarium/views/index.html'
            })


            // done testing

            .state('nodarium example page', {
                url: '/test',
                templateUrl: 'nodarium/views/index.html'
            })

            .state('nodarium settings page', {
                url: '/admin/settings',
                templateUrl: 'nodarium/views/settings/settings_menu.html'
            });
    }
]);
