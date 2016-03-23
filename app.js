angular.module('ClientSSS', ['ngCookies'])

    .controller('UserCtrl', function ($location, $scope, $http, $window, $cookies) {
        $scope.user = {username: 'user', password: 'pass'};
        $scope.message = '';

        $scope.submit = function () {
            $http
                .post('http://localhost:5000/login', $scope.user)
                .error(function (data, status, headers, config) {
                    $cookies.remove('token');
                    $scope.message = 'Error: Invalid user or password';
                });
        };

        $scope.loginWithGoogle = function () {
            $window.location.href = 'http://localhost:5000/loginWithGoogle';
        };

        $scope.getAllObjects = function () {
            $http
                .get('http://localhost:5000/object')
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('Err '+data);
                });
        };

        $scope.getObjectByKey = function () {
            $http
                .get('http://localhost:5000/object/Gruntfile.js')
                .success(function (data, status, headers, config) {
                    //console.log(data);
                    $window.open(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('Err '+data);
                });
        };

        $scope.logout = function () {
            $cookies.remove('token');
        };
    });