'use strict';

/**
 * # MainCtrl
 */
angular.module('Planz')
    .controller('StartCtrl', function ($scope, $stateParams, baseUrl) {
        $scope.shareUrl = baseUrl + '/start/' + $stateParams.planid;
        $scope.planid = $stateParams.planid;
    });
