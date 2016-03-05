'use strict';

/**
 * # StartCtrl
 */
angular.module('Planz')
    .controller('StartCtrl', function ($scope, $stateParams, baseUrl) {
        $scope.shareUrl = baseUrl + '/swipe/' + $stateParams.planid;
        $scope.planid = $stateParams.planid;
        
        $scope.copyText = function () {
            var text = document.getElementById("shareURL");
            text.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('this was a ' + msg + ' swag');
            } catch (err) {
                console.log('Let us just hope you never see this');
            }
        }
    });
