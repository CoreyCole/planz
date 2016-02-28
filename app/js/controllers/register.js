'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('RegisterCtrl', function ($scope, $firebaseArray, $state, $http, $filter, eventfulKey, rootRef) {
        $scope.Planz = $firebaseArray(rootRef.child('Planz'));

        $scope.city = 'Vancouver';
        $scope.date = new Date();
        $scope.time = moment().format('LT');

        $scope.$watch('time', function() {
            $scope.timeChange = moment(new Date($scope.time));
        });

        $scope.loading = false;
        
        function invalidEvent(event) {
            // check that the title doesn't have the word "cancelled" in it
            if (event.title.toLowerCase().indexOf("cancelled") > -1) {
                return true;
            }
            
            // check that the start/end time are valid
            if (!dateMatch(event.start_time) || (!event.stop_time == null && !dateMatch(event.stop_time))) {
                return true;
            }
            
            if (!eventLater(event.start_time)) {
                return true;
            }
            
            return false;
        }
        
        function dateMatch(eventfulTime) {
            // eventful returns time in yyyy-mm-dd hh:mm:ss format
            var eventfulYear = eventfulTime.substring(0, 4);
            var eventfulMonth = eventfulTime.substring(5, 7);
            var eventfulDay = eventfulTime.substring(8, 10);
            
            if (eventfulMonth.substring(0, 1) == "0") {
                eventfulMonth = eventfulMonth.substring(1, 2);
            }
            if (eventfulDay.substring(0, 1) == "0") {
                eventfulDay = eventfulDay.substring(1, 2);
            }
            
            var dateYear = $scope.date.getFullYear().toString();
            var dateMonth = ($scope.date.getMonth() + 1).toString();
            var dateDay = $scope.date.getDate().toString();
            
            return $scope.date.getFullYear().toString() == eventfulYear &&
                   ($scope.date.getMonth() + 1).toString() == eventfulMonth &&
                   $scope.date.getDate().toString() == eventfulDay;
        }
        
        function eventLater(eventfulTime) {
            var date = $scope.time.format('HH:mm');
            var hour = date.substring(0,2);
            var minute = date.substring(3,5);
            
            var eventfulHour = eventfulTime.substring(11,13);
            var eventfulMinute = eventfulTime.substring(14,16);
            
            if (eventfulHour < hour) {
                return false;
            }
            
            else return eventfulMinute >= minute;
        }

        $scope.register = function() {
            var plan = {
                city: $scope.city,
                date: getDateEventfulFormat(),
                time: moment(new Date($scope.time.toString())).format('LT'),
                numSwipes: $scope.numSwipes
            };

            $scope.Events = $firebaseArray(rootRef.child('Events'));
            $scope.Events.$loaded().then(function(ref) {
                $scope.loading = true;
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
                            var event = res.data.events.event[i];
                            
                            if (invalidEvent(event)) {
                                res.data.events.event.splice(i, 1);
                                i--;
                            }
                            else if (event.image == null) {
                                event.image = { medium: { url: notAvailableImg } }
                            } else if (event.image.medium.url == "http://s1.evcdn.com/store/skin/no_image/categories/128x128/other.jpg") {
                                event.image.medium.url = notAvailableImg;
                            }
                        }
                        
                        $scope.Events.$add({
                            events: [res.data.events.event],
                            date: getDateEventfulFormat(),
                        });
                        $scope.Planz.$add(plan).then(function(ref) {
                            $state.go('start', { planid : ref.key() });
                            $scope.loading = false;
                        });
                    });
                } else {
                    $scope.Planz.$add(plan).then(function(ref) {
                        $state.go('start', { planid : ref.key() });
                        $scope.loading = false;
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
