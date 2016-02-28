'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('IndexCtrl', function ($scope, $firebaseArray, $state, rootRef) {


        $scope.register = function() {
            console.dir($scope.plan);
            $scope.planz = $firebaseArray(rootRef.child('Planz'));
            $scope.plan.date = $scope.plan.date.toString();
            $scope.plan.startTime = $scope.plan.startTime.toString();
            $scope.planz.$add($scope.plan).then(function(ref) {
                $state.go('start', { planid : ref.key() });
            });
        }
    });