'use strict';

var app = angular.module('chia', [
    'firebase',
    'vr.directives.slider',
    'fsCordova'
]);

app.controller('MyController', ['$scope', '$firebase', '$timeout', '$interval', 'CordovaService', function($scope, $firebase, $timeout, $interval, CordovaService) {
    function initialize() {
        $scope.deviceState = 'offline';
        
        var messagesReference = new Firebase('https://radiant-fire-2876.firebaseio.com/messages');
        var vibrationLevelReference = new Firebase('https://radiant-fire-2876.firebaseio.com/vibration/level');
        $scope.messages = $firebase(messagesReference);
    //    $scope.vibration = $firebase(vibrationReference);
        $scope.vibration = {};
        $scope.vibration.level = $firebase(vibrationLevelReference);
        $scope.messages.$on("change", function() {
            console.log("A remote change was applied locally!");
            $scope.vibrate();
        });
    
        console.log("before bind $scope.vibration: " + JSON.stringify($scope.vibration));
        $scope.vibration.level.$bind($scope, "vibration.level");
        console.log("after bind $scope.vibration: " + JSON.stringify($scope.vibration));
        
        $scope.vibration.level.$on("change", function() {
            console.log("$scope.vibration.level.$on change $scope.vibration: " + JSON.stringify($scope.vibration));
        });
        
        $scope.$watch("vibration.level", function(newValue, oldValue) {
            console.log("watch $scope.vibration: " + JSON.stringify($scope.vibration));
            if (newValue > 0) {
                $scope.startVibration();
            } else {
                $scope.stopVibration();
            }
            updateMotor(newValue);
        });
    }
    
    initialize();

    CordovaService.ready.then(function() {
        // Cordova is ready
        $scope.startDiscover();
    });

    function updateCordovaDebugInfo() {
        var $rootHtml = angular.element(document.documentElement);

        if (window.cordova) {
            $rootHtml.addClass('device')
                .addClass(window.device.model.replace(/\s+/g,'').toLowerCase())
                .addClass(window.device.platform.replace(/\s+/g,'').toLowerCase());
        }

/*
        var element = document.getElementById('deviceProperties');
        element.innerHTML = '<strong>Model:</strong> '    + window.device.model.replace(/\s+/g,'').toLowerCase()    + '<br>' +
                            '<strong>Platform:</strong> ' + window.device.platform.replace(/\s+/g,'').toLowerCase() + '<br>' +
                            '<strong>Pixel Density:</strong> ' +  window.devicePixelRatio + '<br>';
*/

        if (parseFloat(window.device.version) === 7.0) {
            $rootHtml.addClass('ios7');
        }
    }

    $scope.refreshDeviceList = function() {
        // deviceList.innerHTML = ''; // empties the list
        $scope.deviceList = [];
        rfduino.discover(5, onDiscoverDevice, onError);
        $scope.deviceState = 'discovering';
    };
        
    function onDiscoverDevice(device) {
/*
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                'Advertising: ' + device.advertising + '<br/>' +
                device.uuid;

        listItem.setAttribute('uuid', device.uuid);
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
*/
        
        $scope.deviceList.push(device);
        $scope.connect(device.uuid);
    }
        
    $scope.connect = function(uuid) {
        var onConnect = function() {
            $scope.stopDiscover();
            
            $scope.deviceState = 'connected';
            rfduino.onData(onData, onError);
//                showDetailPage();
        };

        rfduino.connect(uuid, onConnect, onError);
    };
        
    function onData(data) {
        console.log(data);
//        var celsius = arrayBufferToFloat(data),
//            fahrenheit = celsius * 1.8 + 32;

//        tempCelsius.innerHTML = celsius.toFixed(2);
//        tempFahrenheit.innerHTML = fahrenheit.toFixed(2);
    }
        
    function disconnect() {
        $scope.deviceState = 'offline';
        rfduino.disconnect(showMainPage, onError);
    }
        
    function showMainPage() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    }

    function showDetailPage() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    }
        
    function onError(reason) {
        console.log(reason); // real apps should use notification.alert
        $scope.deviceState = 'offline';
        $scope.startDiscover();
    }
    
    var stopVibrationInterval;
    $scope.startVibration = function () {
        // Don't start a new vibration if we are already vibrating
        if (angular.isDefined(stopVibrationInterval)) return;

        if (navigator && navigator.notification) {
            stopVibrationInterval = $interval(function () {
                if ($scope.vibration.level > 0) {
                    navigator.notification.vibrate($scope.vibration.level);
                } else {
                    $scope.stopVibration();
                }
            }, 100);
        }
    };
    
    $scope.stopVibration = function () {
        if (angular.isDefined(stopVibrationInterval)) {
            $interval.cancel(stopVibrationInterval);
            stopVibrationInterval = undefined;
        }
    };

    var stopDiscoverInterval;
    $scope.startDiscover = function () {
        // Don't start a new discover if we are already discovering
        if (angular.isDefined(stopDiscoverInterval)) return;

        if (window.rfduino) {
            stopDiscoverInterval = $interval(function () {
                $scope.refreshDeviceList();
            }, 5200); // discover is running for 5 seconds, so wait a little longer before starting again
        }
    };
    
    $scope.stopDiscover = function () {
        if (angular.isDefined(stopDiscoverInterval)) {
            $interval.cancel(stopDiscoverInterval);
            stopDiscoverInterval = undefined;
        }
    };

    function updateMotor(level) {
        var levelNormalized = level * 255 / 100;
        if (window.rfduino) {
            rfduino.isConnected(
                function() {
                    console.log("RFduino is connected");

                    var array = new Uint8Array(2);
                    array[0] = 0; // index
                    array[1] = levelNormalized;
                    rfduino.write(levelNormalized.toString(), function() {
                        console.log("RFduino write succeeded");
                    }, function() {
                        console.log("RFduino write failed");
                    });
                },
                function() {
                    console.log("RFduino is *not* connected");
                }
            );
        }
    }

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