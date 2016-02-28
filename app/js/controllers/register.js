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
        $scope.numSwipes;
        
        function copyText() {
            var text = document.getElementById("shareURL");
            text.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }
        
        function getDateEventfulFormat() {
            var year = $scope.date.getFullYear().toString();
            var month = $scope.date.getMonth();
            if (month < 10) {
                month = "0" + month.toString();
            } else {
                month = month.toString();
            }

            var date = $scope.date.getDate().toString();
            if (date < 10) {
                date = "0" + date.toString();
            } else {
                date = date.toString();
            }         

            return year + month + date + "00";
        };

        $scope.register = function() {
            var plan = {
                city: $scope.city,
                date: getDateEventfulFormat,
                time: $scope.time.format('LT'),
                numSwipes: $scope.numSwipes
            };

            $scope.Planz.$add(plan).then(function(ref) {
                $state.go('start', { planid : ref.key() });
            });
        };
    });
