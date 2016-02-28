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
    .constant('baseUrl', 'http://localhost:9000/index.html#')
    .factory('rootRef', function(firebaseUrl) {
        return new Firebase(firebaseUrl);
    });