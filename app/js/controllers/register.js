'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('RegisterCtrl', function ($scope, $firebaseArray, $state, $http, eventfulKey, rootRef) {
        $scope.Planz = $firebaseArray(rootRef.child('Planz'));

        $scope.city = 'Vancouver';
        $scope.date = new Date();
        $scope.time = moment();

        $scope.register = function() {
            var plan = {
                city: $scope.city,
                date: getDateEventfulFormat(),
                time: $scope.time.format('LT'),
                numSwipes: $scope.numSwipes
            };

            $scope.Events = $firebaseArray(rootRef.child('Events'));
            $scope.Events.$loaded().then(function(ref) {
                var flag = false;
                for (var i = 0; i < ref.length; i++) {
                    if (ref[i].date === getDateEventfulFormat())
                        flag = true;
                }

                if (!flag) {
                    $http({
                        method: 'GET',
                        url: 'http://api.eventful.com/json/events/search',
                        params: {
                            app_key: eventfulKey,
                            where: $scope.city,
                            date: getDateEventfulFormat() + '-' + getDateEventfulFormat(),
                            sort_order: 'popularity',
                            page_size: 100,
                            page_number: 1
                        }
                    }).then(function (res) {
                        $scope.Events.$add({
                            events: res.data.events.event,
                            date: getDateEventfulFormat(),
                            page: 1
                        });
                        $scope.Planz.$add(plan).then(function(ref) {
                            $state.go('start', { planid : ref.key() });
                        });
                    });
                } else {
                    $scope.Planz.$add(plan).then(function(ref) {
                        $state.go('start', { planid : ref.key() });
                    });
                }
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
