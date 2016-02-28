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
        };
    });
