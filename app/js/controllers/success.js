'use strict';

/**
 * # SuccessCtrl
 */
angular.module('Planz')
    .controller('SuccessCtrl', function ($scope, $firebaseArray, $stateParams, rootRef) {
        $scope.success = $firebaseArray(rootRef.child('Planz').child($stateParams.planid).child('success'));
        $scope.success.$loaded().then(function (successref) {
        	$scope.currentEvent = successref[0].event;
        });
    });
