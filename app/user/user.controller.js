(function() {

    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$http', '$window', '$cookies'];

    function UserController($http, $window, $cookies) {
        let vm = this;

        vm.user = {
            username: 'user',
            password: 'pass'
        };
        vm.message = '';

        vm.submit = submit;
        vm.loginWithGoogle = loginWithGoogle;
        vm.getAllObjects = getAllObjects;
        vm.getObjectByKey = getObjectByKey;
        vm.logout = logout;

        function submit() {
            $http
                .post('http://localhost:5000/login', vm.user)
                .error(function (data, status, headers, config) {
                    $cookies.remove('token');
                    vm.message = 'Error: Invalid user or password';
                });
        };

        function loginWithGoogle() {
            $window.location.href = 'http://localhost:5000/loginWithGoogle';
        };

        function getAllObjects() {
            $http
                .get('http://localhost:5000/object')
                .success(function (data, status, headers, config) {
                    console.log(data);
                })
                .error(function (data, status, headers, config) {
                    vm.message = 'Err ' + data;
                });
        };

        function getObjectByKey() {
            $http
                .get('http://localhost:5000/object/Gruntfile.js')
                .success(function (data, status, headers, config) {
                    $window.open(data);
                })
                .error(function (data, status, headers, config) {
                    vm.message = 'Err ' + data;
                });
        };

        function logout() {
            $cookies.remove('token');
            //TODO remove '/#'
        };
    }

})();