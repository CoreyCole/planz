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