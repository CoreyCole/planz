'use strict';

/**
 * # WaitingCtrl
 */
angular.module('Planz')
    .controller('WaitingCtrl', function ($scope, $firebaseArray, $state, $stateParams, rootRef) {
        $scope.success = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('success'));
        $scope.success.$loaded().then(function (successref) {
        	if (successref.length > 0 ) {
                $state.go('success', { planid : $stateParams.planid });
            }

            $scope.success.$watch(function() {
                $state.go('success', { planid : $stateParams.planid });
            });
        });
    });