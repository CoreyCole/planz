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
    .constant('notAvailableImageUrl', "http://www.motorolasolutions.com/content/dam/msi/images/business/products/accessories/mc65_accessories/kt-122621-50r/_images/static_files/product_lg_us-en.jpg")
    .constant('incorrectImageMediumUrl', "http://s1.evcdn.com/store/skin/no_image/categories/128x128/other.jpg")
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