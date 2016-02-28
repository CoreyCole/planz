'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('SwipeCtrl', function ($scope, $firebaseObject, $firebaseArray, $state, $stateParams, $http, eventfulKey, rootRef) {
        $scope.loading = false;
        
        var eventIndex = 0;
        var pageIndex = 0;
        var pageLimit = 3;

        var categoriesCount = {
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
            var date = $scope.time;
            var hour = date.substring(0,2);
            var minute = date.substring(3,5);
            
            var eventfulHour = eventfulTime.substring(11,13);
            var eventfulMinute = eventfulTime.substring(14,16);
            
            if (eventfulHour < hour) {
                return false;
            }
            
            else return eventfulMinute >= minute;
        }

        $scope.plan = $firebaseObject(rootRef.child('Planz').child($stateParams.planid));
        $scope.plan.$loaded().then(function (planref) {
            $scope.date = planref.date;
            $scope.numSwipes = planref.numSwipes;
            $scope.time = planref.time;
            $scope.city = planref.city;

            $scope.success = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('success'))
            $scope.success.$loaded().then(function(planEventsref) {

                if (planEventsref.length > 0 ) {
                    $state.go('success', { planid : $stateParams.planid });
                }

                $scope.success.$watch(function() {
                    $state.go('success', { planid : $stateParams.planid });
                });

                $scope.planEvents = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('events'));
                $scope.planEvents.$loaded().then(function(planEventsref) {

                    $scope.planCats = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('categories'));
                    $scope.planCats.$loaded().then(function(planCatsref) {

                        $scope.Events = $firebaseArray(rootRef.child('Events'));
                        $scope.Events.$loaded().then(function(eventsref) {

                            for (var i = 0; i < eventsref.length; i++) {
                                if (eventsref[i].date === $scope.date) {
                                    $scope.dayEvent = eventsref[i];
                                    getNextPageAndEventIndex();
                                    break;
                                }
                            }
                        });
                    });
                });
            });
        });

        function getNextPageAndEventIndex() {
            $scope.planEvents = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('events'));
            $scope.Events.$loaded().then(function(eventsref) {

                for (var i = 0; i < eventsref.length; i++) {
                    if (eventsref[i].date === $scope.date) {
                        $scope.dayEvent = eventsref[i];
                    }
                }

                $scope.planCats.$loaded().then(function(planCatsref) {
                    for (var i = pageIndex; i < $scope.dayEvent.events.length; i++) {
                        for (var j = eventIndex; j < $scope.dayEvent.events[i].length; j++) {
                            var flag = false;
                            for (var k = 0; k < $scope.dayEvent.events[i][j].categories.category.length; k++) {
                                for (var l = 0; l < $scope.planCats.length; l++) {
                                    if ($scope.dayEvent.events[i][j].categories.category[k].id === planCatsref[l].category) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag) {
                                    break;
                                }
                            }
                            if (flag) {
                                flag = false;
                            }
                            else {
                                pageIndex = i;
                                eventIndex = j;
                                $scope.currentEvent = $scope.dayEvent.events[pageIndex][eventIndex];
                                return;
                            }
                        }
                    }

                    console.log(pageIndex);
                    if (pageIndex == pageLimit) {
                        $state.go('waiting', { planid : $stateParams.planid });
                    }
                    else{
                        $scope.loading = true;
                        eventIndex = 0;
                        pageIndex += 1;

                        $http({
                            method: 'GET',
                            url: 'http://api.eventful.com/json/events/search',
                            params: {
                                app_key: eventfulKey,
                                where: $scope.city,
                                'date': $scope.date + '-' + $scope.date,
                                'include': "tags,categories",
                                sort_order: 'popularity',
                                page_size: 100,
                                page_number: pageIndex + 1
                            }
                        }).then(function (res) {
                            var notAvailableImg = "http://www.motorolasolutions.com/content/dam/msi/images/business/products/accessories/mc65_accessories/kt-122621-50r/_images/static_files/product_lg_us-en.jpg";
                            for (var i=0; i<res.data.events.event.length; i++) {
                                if (invalidEvent(event)) {
                                    res.data.events.event.splice(i, 1);
                                    i--;
                                } else if (res.data.events.event[i].image == null) {
                                    res.data.events.event[i].image = { medium: { url: notAvailableImg } }
                                } else if (res.data.events.event[i].image.medium.url == "http://s1.evcdn.com/store/skin/no_image/categories/128x128/other.jpg") {
                                    res.data.events.event[i].image.medium.url = notAvailableImg;
                                }
                            }

                            $scope.dayEvent.events[pageIndex] = res.data.events.event;
                            $scope.Events.$save($scope.dayEvent).then(function(updateRef) {
                                $scope.loading = false;
                                console.log('it worked!');
                                getNextPageAndEventIndex();
                            });
                        });
                    }
                });
            });
        } 

        $scope.swipe = function(right) {
            $scope.Events.$loaded().then(function(eventsref) {
                $scope.planEvents.$loaded().then(function(planEventsref) {
                    $scope.planCats.$loaded().then(function(planCatsref) {

                        var planEventID = $scope.currentEvent.id;
                        var planEventCat = $scope.currentEvent.categories.category;
                        var planEvent;

                        for (var i = 0; i < planEventsref.length; i++) {
                            if (planEventsref[i].eventID === planEventID)
                                planEvent = planEventsref[i];
                        }

                        if (!planEvent) {
                            if (right) {
                                planEvent = {eventID: planEventID, likes: 1, dislikes: 0};
                            }
                            else {
                                planEvent = {eventID: planEventID, likes: 0, dislikes: 1};
                            }
                            $scope.planEvents.$add(planEvent);
                        }

                        else {
                            if (right) {
                                planEvent.likes += 1;
                            }
                            else {
                                planEvent.dislikes += 1;
                            }
                            $scope.planEvents.$save(planEvent).then(function(updateRef) {
                            });
                        }

                        if(!right) {
                            for (var i = 0; i < planEventCat.length; i++) {
                                if (planEventCat[i].id in categoriesCount) {
                                    categoriesCount[planEventCat[i].id].count += 1
                                    if (categoriesCount[planEventCat[i].id].count >= 5) {
                                        console.log('The mystical parrot of paradise');
                                        $scope.planCats.$add({category: planEventCat[i].id });
                                    }
                                }
                            }
                        }

                        if (planEvent.likes >= $scope.numSwipes) {
                            console.log('got here');
                            $scope.success.$add({event: $scope.currentEvent});
                        }

                        else {
                            eventIndex += 1;
                            getNextPageAndEventIndex();
                        }
                    });
                });
            });
        };
    });