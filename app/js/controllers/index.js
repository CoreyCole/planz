'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('IndexCtrl', function ($scope,  $firebaseObject, $firebaseArray, $state, eventfulKey, rootRef) {
        // download the data into a local object
        var syncObject = $firebaseObject(rootRef);
        $scope.Planz = $firebaseArray(rootRef.child('Planz').child());

        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "data");

        console.log($scope.data);
        
        $scope.city = 'Vancouver';
        $scope.date = new Date();
        $scope.time = moment();
        $scope.numSwipes;

        $scope.register = function() {
            var plan = {
                city: $scope.city,
                date: $scope.date,
                time: $scope.time,
                numSwipes: $scope.numSwipes
            };

            $scope.Planz.$add(plan).then(function(ref) {
                $state.go('start', { planid : ref.key() });
            });
        };
        
        var curPage = 1;
        var maxCount = 5;
        var catArr = {
            music: {'count': 0},
            conference: {'count': 0},
            comedy: {'count': 0},
            learning_education: {'count': 0},
            family_fun_kids: {'count': 0},
            festivals_parades: {'count': 0},
            movies_film: {'count': 0},
            food: {'count': 0},
            fundraisers: {'count': 0},
            art: {'count': 0},
            support: {'count': 0},
            holiday: {'count': 0},
            books: {'count': 0},
            attractions: {'count': 0},
            community: {'count': 0},
            business: {'count': 0},
            singles_social: {'count': 0},
            schools_alumni: {'count': 0},
            clubs_associations: {'count': 0},
            outdoors_recreation: {'count': 0},
            performing_arts: {'count': 0},
            animals: {'count': 0},
            politics_activism: {'count': 0},
            sales: {'count': 0},
            science: {'count': 0},
            religion_spirituality: {'count': 0},
            sports: {'count': 0},
            technology: {'count': 0},
            other: {'count': 0}
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
        };
        
        $scope.getEvents = function() {
            $http({
                method: 'GET',
                url: 'http://api.eventful.com/json/events/search',
                params: {
                    app_key: eventfulKey,
                    where: $scope.city,
                    date: $scope.getDate() + '-' + $scope.getDate(),
                    sort_order: 'popularity',
                    page_size: 100,
                    page_number: curPage
                }
            }).then(function (res) {
                // push to firebase
            });
        };
    });