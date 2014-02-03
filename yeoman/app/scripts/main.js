var app = angular.module("chia", ["firebase"]);

app.controller('MyController', ['$scope', '$firebase', function($scope, $firebase) {
    var ref = new Firebase("https://radiant-fire-2876.firebaseio.com/");
    $scope.messages = $firebase(ref);

    $scope.addMessage = function () {
        $scope.messages.$add({from: $scope.name, body: $scope.msg});
        $scope.msg = "";
    };

    $scope.messageKeyDownHandler = function (e) {
        if (e.keyCode != 13) return;
        this.addMessage();
    }
}]);