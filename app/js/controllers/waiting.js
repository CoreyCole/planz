'use strict';

/**
 * # WaitingCtrl
 */
angular.module('Planz')
    .controller('WaitingCtrl', function ($scope, $firebaseObject, $firebaseArray, $state, 
        $stateParams, rootRef) {

        $scope.plan = $firebaseObject(rootRef.child('Planz').child($stateParams.planid));
        $scope.plan.$loaded().then(function (planref) { 

            $scope.numDone = planref.numDone;
            $scope.numSwipes = planref.numSwipes;

            if ($scope.numDone >= $scope.numSwipes)
                $state.go('failure', {planid : $stateParams.planid});

            $scope.plan.$watch(function() {
                if ($scope.numDone >= $scope.numSwipes)
                    $state.go('failure', {planid : $stateParams.planid});
            });

            $scope.success = $firebaseArray(rootRef.child('Planz')
                .child($stateParams.planid).child('success'));
            $scope.success.$loaded().then(function (successref) {
            	if (successref.length > 0)
                    $state.go('success', {planid : $stateParams.planid});

                $scope.success.$watch(function() {
                    $state.go('success', {planid : $stateParams.planid});
                });
            });
        });
    });