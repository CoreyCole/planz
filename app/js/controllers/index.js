'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('IndexCtrl', function ($scope) {
        var ref = new Firebase('https://planz.firebaseio.com/');
        
        $scope.city = 'Vancouver';
        $scope.date = new Date();
        $scope.time = '';
        $scope.numSwipes = 0;
        
        var curPage = 1;
        var maxCount = 5;
        var catArr = [
            { 'name':'music', 'count':0 },
            { 'name':'conference', 'count':0 },
            { 'name':'comedy', 'count':0 },
            { 'name':'learning_education', 'count':0 },
            { 'name':'family_fun_kids', 'count':0 },
            { 'name':'festivals_parades', 'count':0 },
            { 'name':'movies_film', 'count':0 },
            { 'name':'food', 'count':0 },
            { 'name':'fundraisers', 'count':0 },
            { 'name':'art', 'count':0 },
            { 'name':'support', 'count':0 },
            { 'name':'holiday', 'count':0 },
            { 'name':'books', 'count':0 },
            { 'name':'attractions', 'count':0 },
            { 'name':'community', 'count':0 },
            { 'name':'business', 'count':0 },
            { 'name':'singles_social', 'count':0 },
            { 'name':'schools_alumni', 'count':0 },
            { 'name':'clubs_associations', 'count':0 },
            { 'name':'outdoors_recreation', 'count':0 },
            { 'name':'performing_arts', 'count':0 },
            { 'name':'animals', 'count':0 },
            { 'name':'politics_activism', 'count':0 },
            { 'name':'sales', 'count':0 },
            { 'name':'science', 'count':0 },
            { 'name':'religion_spirituality', 'count':0 },
            { 'name':'sports', 'count':0 },
            { 'name':'technology', 'count':0 },
            { 'name':'other', 'count':0 }
        ];
        
        function getDateEventfulFormat() {
            var year = $scope.date.getFullYear().toString();
            var month = $scope.date.getMonth();
            if (month < 10) {
                month = "0" + month.toString();
            } else {
                month = month.toString();
            }

            var date = $scope.date.getDate().toString();
            if (date < 10) {
                date = "0" + date.toString();
            } else {
                date = date.toString();
            }         

            return year + month + date + "00";
        };
        
        $scope.getEvents = function() {
            $http({
                method: 'GET',
                url: 'http://api.eventful.com/json/events/search',
                params: {
                    app_key: eventfulKey,
                    where: $scope.city,
                    date: $scope.getDate() + '-' + $scope.getDate(),
                    sort_order: 'popularity'
                    page_size: 100,
                    page_number: curPage
                }
            }).then(function (res) {
                // push to firebase
            });
            }
        };
        
        
    });