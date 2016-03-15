'use strict';

/**
 * # RegisterCtrl
 */
angular.module('Planz')
    .controller('RegisterCtrl', function ($scope, $firebaseArray, $state, $http, $filter,
        notAvailableImageUrl, incorrectImageMediumUrl, eventfulKey, rootRef) {

        $scope.Planz = $firebaseArray(rootRef.child('Planz'));
        $scope.loading = false;
        $scope.date = new Date();
        $scope.time = moment().format('LT');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    for (var i = 0; i < results[0].address_components.length; i++)
                        if (results[0].address_components[i].types.indexOf('locality') >= 0)
                            $scope.$apply(function() { 
                                console.log("but what about me?");
                                $scope.city = results[0].address_components[i].short_name;
                            });
                });
            });
        }

        $scope.$watch('time', function() {
            $scope.timeChange = moment(new Date($scope.time));
        });

        $scope.loading = false;
        
        function invalidEvent(event) {
            // check that the title doesn't have the word "cancelled" in it
            return event.title.toLowerCase().indexOf("cancelled") > -1 ||
                // check that the start/end time are valid
                !dateMatch(event.start_time) || 
                (!event.stop_time == null && !dateMatch(event.stop_time));
        }
        
        function dateMatch(eventfulTime) {
            // eventful returns time in yyyy-mm-dd hh:mm:ss format
            var eventfulYear = eventfulTime.substring(0, 4);
            var eventfulMonth = eventfulTime.substring(5, 7);
            var eventfulDay = eventfulTime.substring(8, 10);
            
            if (eventfulMonth.substring(0, 1) == "0") 
                eventfulMonth = eventfulMonth.substring(1, 2);

            if (eventfulDay.substring(0, 1) == "0") 
                eventfulDay = eventfulDay.substring(1, 2);
            
            var dateYear = $scope.date.getFullYear().toString();
            var dateMonth = ($scope.date.getMonth() + 1).toString();
            var dateDay = $scope.date.getDate().toString();
            
            return $scope.date.getFullYear().toString() == eventfulYear &&
                   ($scope.date.getMonth() + 1).toString() == eventfulMonth &&
                   $scope.date.getDate().toString() == eventfulDay;
        }

        $scope.register = function() {
            $scope.loading = true;
            var plan = {
                city: $scope.city,
                date: getDateEventfulFormat(),
                time: moment(new Date($scope.time.toString())).format('HH:mm'),
                numSwipes: $scope.numSwipes,
                numDone: 0
            };

            $scope.Events = $firebaseArray(rootRef.child('Events'));
            $scope.Events.$loaded().then(function(ref) {
                $scope.loading = true;
                var flag = false;

                for (var i = 0; i < ref.length; i++) 
                    if (ref[i].date === getDateEventfulFormat() && ref[i].city === $scope.city)
                        flag = true;

                if (!flag) {
                    var url = 'https://api.eventful.com/jsonp/events/search?app_key=' + eventfulKey +
                                '&where= ' + $scope.city + 
                                '&date=' + getDateEventfulFormat() + '-' + getDateEventfulFormat() +
                                '&include=tags,categories' + '&sort_order=popularity' +
                                '&page_size=100' + '&page_number=1' + 
                                '&callback=JSON_CALLBACK';
                                
                    $http.jsonp(url).then(function (res) {
                        for (var i = 0; i < res.data.events.event.length; i++) {
                            var eventi = res.data.events.event[i];
                            
                            if (invalidEvent(eventi)) {
                                res.data.events.event.splice(i, 1);
                                i--;
                            }
                            else if (eventi.image == null) 
                                eventi.image = {medium: {url: notAvailableImageUrl}}
                            else if (eventi.image.medium.url == incorrectImageMediumUrl)
                                eventi.image.medium.url = notAvailableImageUrl;
                        }
                        
                        $scope.Events.$add({
                            events: [res.data.events.event],
                            date: getDateEventfulFormat(),
                            city: $scope.city,
                        });
                        $scope.Planz.$add(plan).then(function(ref) {
                            $state.go('start', {planid : ref.key()});
                            $scope.loading = false;
                        });
                    });
                } 
                else {
                    $scope.Planz.$add(plan).then(function(ref) {
                        $state.go('start', {planid : ref.key()});
                        $scope.loading = false;
                    });
                }
            });
        };

        function getDateEventfulFormat() {
            var year = $scope.date.getFullYear().toString();

            // getMonth returns 0 based month: [0,11]
            var month = $scope.date.getMonth() + 1;
            if (month < 10) 
                month = "0" + month.toString();
            else 
                month = month.toString();

            var date = $scope.date.getDate().toString();
            if (date < 10) 
                date = "0" + date.toString();
            else 
                date = date.toString();

            return year + month + date + "00";
        }
    });
