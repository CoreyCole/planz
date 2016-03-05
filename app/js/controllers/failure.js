'use strict';

/**
 * # FailureCtrl
 */
angular.module('Planz')
    .controller('FailureCtrl', function ($scope, $firebaseObject, $state, $stateParams, rootRef) {
        $scope.plan = $firebaseObject(rootRef.child('Planz').child($stateParams.planid));
        $scope.plan.$loaded().then(function (planref) {
        	if (planref.numDone < planref.numSwipes)
                $state.go('start', {planid : $stateParams.planid});
        });
    });