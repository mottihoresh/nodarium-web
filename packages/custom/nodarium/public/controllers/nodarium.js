'use strict';

angular.module('mean.nodarium')
    .controller('SettingsMenuController', ['$scope', '$rootScope', 'Global', 'Nodarium', 'Menus',
        function ($scope, $rootScope, Global, Nodarium, Menus) {
            $scope.global = Global;
            $scope.package = {
                name: 'nodarium'
            };

            $scope.test = 'Test :)';



            // Default hard coded menu items for main menu
            var defaultMainMenu = [];

            // Query menus added by modules. Only returns menus that user is allowed to see.
            function queryMenu(name, defaultMenu) {

                console.log('test');

                Menus.query({
                    name: name,
                    defaultMenu: defaultMenu
                }, function(menu) {
                    $scope.menus[name] = menu;
                });
            }

            // Query server for menus and check permissions
            queryMenu('settings', defaultMainMenu);


        }
    ])

    .controller('NodariumController', ['$scope', 'Global', 'Nodarium',
        function ($scope, Global, Nodarium) {
            $scope.global = Global;
            $scope.package = {
                name: 'nodarium'
            };
        }
    ]);
