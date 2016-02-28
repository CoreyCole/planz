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
                            'date': getDateEventfulFormat() + '-' + getDateEventfulFormat(),
                            'include': "tags,categories",
                            sort_order: 'popularity',
                            page_size: 100,
                            page_number: 1,
                        }
                    }).then(function (res) {
                        var notAvailableImg = "http://www.motorolasolutions.com/content/dam/msi/images/business/products/accessories/mc65_accessories/kt-122621-50r/_images/static_files/product_lg_us-en.jpg";
                        for (var i=0; i<res.data.events.event.length; i++) {
                            if (res.data.events.event[i].image == null) {
                                res.data.events.event[i].image = { medium: { url: notAvailableImg } }
                            } else if (res.data.events.event[i].image.medium.url == "http://s1.evcdn.com/store/skin/no_image/categories/128x128/other.jpg") {
                                res.data.events.event[i].image.medium.url = notAvailableImg;
                            }
                        }
                        $scope.Events.$add({
                            events: [res.data.events.event],
                            date: getDateEventfulFormat(),
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
            // getMonth returns 0 based month: [0,11]
            var month = $scope.date.getMonth() + 1;
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
