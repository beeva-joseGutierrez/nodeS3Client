angular.module('ClientSSS', ['ngCookies'])

    .controller('UserCtrl', function ($location, $scope, $http, $window, $cookies) {
        $scope.user = {username: 'user', password: 'pass'};
        $scope.message = '';
        $scope.submit = function () {
            $http
                .post('http://localhost:5000/login', $scope.user)
                .success(function (data, status, headers, config) {
                    $window.sessionStorage.token = data.token;
                    //TODO cookies
                    //$cookies.put('token', data.token);

                    $http.post('http://localhost:5000/auth',{token: $window.sessionStorage.token})
                        .success(function(data, status, headers, config) {
                            console.log(data);
                        })
                        .error(function (data, status, headers, config) {
                            console.log('err');
                        });
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;

                    // Handle login errors here
                    $scope.message = 'Error: Invalid user or password';
                });
        };

        $scope.loginWithGoogle = function () {
            $http
                .get('http://localhost:5000/loginWithGoogle')
                .success(function (data, status, headers, config) {
                    //console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('Err '+data);
                });
        };

        $scope.getAllObjects = function () {
            $http
                .post('http://localhost:5000/object', {token: $window.sessionStorage.token})
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('Err '+data);
                });
        };

        $scope.getObjectByKey = function () {
            $http
                .post('http://localhost:5000/object/Gruntfile.js', {token: $window.sessionStorage.token})
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('Err '+data);
                });
        };

        $scope.logout = function () {
            $window.sessionStorage.removeItem('token');
        };
    });