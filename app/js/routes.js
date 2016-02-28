'use strict';

/**
 * Angular ui.router file
 */
angular.module('Planz')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('new', {
                url: '/',
                templateUrl: 'views/new.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html'
            })
            .state('start', {
                url: '/start/:planid',
                templateUrl: 'views/start.html'
            })
            .state('swipe', {
                url: '/swipe/:planid',
                templateUrl: 'views/swipe.html'
            })
            .state('success', {
                url: '/success/:planid',
                templateUrl: 'views/success.html'
            })
            .state('waiting', {
                url: '/waiting/:planid',
                templateUrl: 'views/waiting.html'
            });


        $urlRouterProvider.otherwise('/');
    });
