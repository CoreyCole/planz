'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('SwipeCtrl', function ($scope, $firebaseObject, $firebaseArray, $stateParams, $http, eventfulKey, rootRef) {
        var eventIndex = 95;

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

        $scope.plan = $firebaseObject(rootRef.child('Planz').child($stateParams.planid));
        $scope.plan.$loaded().then(function (planref) {
            $scope.date = planref.date;

            $scope.planEvents = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('events'));
            $scope.planEvents.$loaded().then(function(planEventsref) {

                $scope.planCats = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('categories'));
                $scope.planCats.$loaded().then(function(planCatsref) {

                    $scope.Events = $firebaseArray(rootRef.child('Events'));
                    $scope.Events.$loaded().then(function(eventsref) {

                        for (var i = 0; i < eventsref.length; i++) {
                            if (eventsref[i].date === $scope.date) {
                                $scope.dayEvents = eventsref[i].events;
                                $scope.currPage = eventsref[i].page;
                                $scope.firebaseEventID = eventsref[i].$id;
                            }
                        }
                        $scope.currentEvent = $scope.dayEvents[eventIndex];
                    });
                });
            });
        });

        $scope.swipe = function(right) {
            $scope.Events.$loaded().then(function(eventsref) {
                $scope.planEvents.$loaded().then(function(planEventsref) {

                    var planEventID = $scope.currentEvent.id;
                    var planEvent;
                    for (var i = 0; i < planEventsref.length; i++) {
                        if (planEventsref[i].eventID === planEventID)
                            planEvent = planEventsref[i];
                    }

                    if (!planEvent) {
                        if (right) {
                            $scope.planEvents.$add({ eventID: planEventID, likes: 1, dislikes: 0});
                        }
                        else {
                            $scope.planEvents.$add({ eventID: planEventID, likes: 0, dislikes: 1});
                        }
                    }

                    else {
                        if (right) {
                            planEvent.likes += 1;
                        }
                        else {
                            planEvent.dislikes += 1;
                        }
                        $scope.planEvents.$save(planEvent).then(function(updateRef) {
                            console.log('it did someting');
                        });
                    }

                    eventIndex += 1;
                    if (eventIndex < $scope.dayEvents.length) {
                        $scope.currentEvent = $scope.dayEvents[eventIndex];
                    } else {
                        $scope.currPage += 1;
                        $http({
                            method: 'GET',
                            url: 'http://api.eventful.com/json/events/search',
                            params: {
                                app_key: eventfulKey,
                                where: $scope.city,
                                date: $scope.date + '-' + $scope.date,
                                sort_order: 'popularity',
                                page_size: 100,
                                page_number: $scope.currPage
                            }
                        }).then(function (res) {
                            var arr = res.data.events.event;
                            for (var i = 0; i < arr.length; i++) {
                                $scope.dayEvents.push( arr[i] );
                            }
                            console.log($scope.dayEvents.length);
                        });
                        $scope.currentEvent = $scope.dayEvents[eventIndex];
                    }
                });
            });
        };

        // TODO add page 2 (more than first 100)

        // TODO Query only events that have image (not the hot air balloon)

        // TODO when matthew finds his precious categories
        // function getNextIndex() {
        //     var i = 0;
        //     while (i < $scope.dayEvents.length && $scope.planCats.indexOf($scope.dayEvents[i].)) {
        //         i++;
        //     }
        // }
    });