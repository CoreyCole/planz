'use strict';

/**
 * Main module of the application.
 */
angular.module('Planz', [
    'ui.router',
    'firebase',
    'ngMaterial',
    'ngMaterialDatePicker'
])
    .constant('firebaseUrl', 'https://planz.firebaseio.com/')
    .constant('eventfulKey', 'wKZhJ3S2hDDLHtD5')
    .factory('baseUrl', function() {
        if (location.hostname === 'localhost') 
            return 'http://localhost:9000/index.html#'
        else
            return 'https://planz.firebaseapp.com/#'
    })
    .factory('rootRef', function(firebaseUrl) {
        return new Firebase(firebaseUrl);
    });