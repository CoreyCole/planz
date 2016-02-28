'use strict';

/**
 * Angular ui.router file
 */
angular.module('Planz')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main.html'
            });

        $urlRouterProvider.otherwise('/');
    });
