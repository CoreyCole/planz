'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('SwipeCtrl', function ($scope, $firebaseObject, $firebaseArray, $stateParams, eventfulKey, rootRef) {
        var eventIndex = 0;

        var categories = {
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

        var planObject = $firebaseObject(rootRef.child('Planz').child($stateParams.planid));

        planObject.$bindTo($scope, "plan");

        planObject.$loaded(function () { 
            console.log($scope.plan);

            var eventsList = $firebaseObject(rootRef.child('Planz').child($stateParams.planid).child('events'));
            var dayObject = $firebaseObject(rootRef.child('Events').child($scope.plan.dayid));
            
            dayObject.$bindTo($scope, "day");

            dayObject.$loaded(function() {
                console.log($scope.day);

                swipe = function(right) {
                    if (eventsList.$indexFor($scope.day))
                    $scope.plan.$indexFor
                }
                

            });
        });
    });
