'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('RegisterCtrl', function ($scope, $firebaseArray, $state, rootRef) {
        $scope.Planz = $firebaseArray(rootRef.child('Planz'));

        $scope.city = 'Vancouver';
        $scope.date = new Date();
        $scope.time = moment();

        $scope.register = function() {
            var plan = {
                city: $scope.city,
                date: $scope.date.toString(),
                time: $scope.time.toString(),
                numSwipes: $scope.numSwipes
            };

            $scope.Planz.$add(plan).then(function(ref) {
                $state.go('start', { planid : ref.key() });
            });

            $scope.Events = $firebaseArray(rootRef.child('Events').child('date').equalTo($scope.date));
            $scope.Events.$loaded().then(function(ref) {
                console.log(ref);
            });

            $http({
                method: 'GET',
                url: 'http://api.eventful.com/json/events/search',
                params: {
                    app_key: eventfulKey,
                    where: $scope.city,
                    date: getDateEventfulFormat() + '-' + getDateEventfulFormat(),
                    sort_order: 'popularity',
                    page_size: 100,
                    page_number: curPage
                }
            }).then(function (res) {
                // push to firebase
            });
        };

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
        }
    });
