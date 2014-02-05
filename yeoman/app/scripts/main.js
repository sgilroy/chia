'use strict';

var app = angular.module('chia', ['firebase', 'vr.directives.slider']);

app.controller('MyController', ['$scope', '$firebase', '$timeout', '$interval', function($scope, $firebase, $timeout, $interval) {
    var messagesReference = new Firebase('https://radiant-fire-2876.firebaseio.com/messages');
//    var vibrationReference = new Firebase('https://radiant-fire-2876.firebaseio.com/vibration');
    var vibrationLevelReference = new Firebase('https://radiant-fire-2876.firebaseio.com/vibration/level');
    $scope.messages = $firebase(messagesReference);
//    $scope.vibration = $firebase(vibrationReference);
    $scope.vibration = {};
    $scope.vibration.level = $firebase(vibrationLevelReference);
    $scope.messages.$on("change", function() {
        console.log("A remote change was applied locally!");
        $scope.vibrate();
    });

//    $scope.vibration.$add({ level: 0 });
//    $scope.vibration.$save("level");
//    if (!$scope.vibration) {
//        $scope.vibration = { level: 0 };
//    }
    
//    if (!$scope.vibration.level) {
//        $scope.vibration.$add({level: 0});
//    }
    
    console.log("before bind $scope.vibration: " + JSON.stringify($scope.vibration));
    $scope.vibration.level.$bind($scope, "vibration.level");
    console.log("after bind $scope.vibration: " + JSON.stringify($scope.vibration));
    
    $scope.vibration.level.$on("change", function() {
        console.log("$scope.vibration.level.$on change $scope.vibration: " + JSON.stringify($scope.vibration));
    });
    
    $scope.$watch("vibration.level", function(newValue, oldValue) {
//        $scope.vibration.$set({level: newValue});
        console.log("watch $scope.vibration: " + JSON.stringify($scope.vibration));
        if (newValue > 0) {
            $scope.startVibration();
        } else {
            $scope.stopVibration();
        }
    });
    
    var stop;
    $scope.startVibration = function () {
        // Don't start a new vibration if we are already vibrating
        if (angular.isDefined(stop)) return;

        if (navigator && navigator.notification) {
            stop = $interval(function () {
                if ($scope.vibration.level > 0) {
                    navigator.notification.vibrate($scope.vibration.level);
                } else {
                    $scope.stopVibration();
                }
            }, 100);
        }
    };

    $scope.stopVibration = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.$on('$destroy', function () {
        // Make sure that the interval is destroyed too
        $scope.stopVibration();
    });

    $scope.addMessage = function () {
        if ($scope.name && $scope.msg) {
            $scope.messages.$add({from: $scope.name, body: $scope.msg});
            $scope.msg = '';
        }
    };

    $scope.messageKeyDownHandler = function (e) {
        if (e.keyCode === 13) {
            this.addMessage();
        }
    };
    
    $scope.vibrate = function() {
        console.log('vibrate()');
        $scope.vibrating = true;
        $timeout(function() {
            $scope.vibrating = false;
        }, 1000);
        
        if (navigator && navigator.notification) {
            console.log('attempting vibrate');
            navigator.notification.vibrate(1000);
        }
    };
}]);