'use strict';

describe('Controller: UserController', function() {
    beforeEach(module('app'));  //it is needed angular-mocks

    var $controller, $httpBackend, $cookies;
    var controller;

    beforeEach(inject(function(_$controller_, $injector, _$cookies_){
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        $cookies = _$cookies_;

        controller = $controller('UserController', {});
    }));

    describe('Login', function() {
        describe('login successful', function() {
            var expectedRequest;
            beforeEach(function () {
                controller.user.username = 'userTest';
                controller.user.password = 'passTest';

                expectedRequest = {
                    username: 'userTest',
                    password: 'passTest'
                };
            });

            it('should send username and password to server', function () {
                $httpBackend.expectPOST('http://localhost:5000/login', expectedRequest).respond(201, 'Ok');

                controller.submit();
                $httpBackend.flush();
            });
        });

        describe('login with Google', function() {
            var $window;
            beforeEach(inject(function(_$window_) {
                $window = _$window_;
            }));

            it('should open Google login url', function() {
                //$httpBackend.expectGET('http://localhost:5000/loginWithGoogle');
                spyOn($window, 'location').and.callFake(function() {
                    return true;
                });

                controller.loginWithGoogle();
                //$httpBackend.flush();

                expect($window.location.href).toEqual('http://localhost:5000/loginWithGoogle');
            });
        });

        describe('login failed', function() {
            beforeEach(function() {
                $cookies.token = 'tokenToRemove';

                controller.user.username = 'userFailTest';
                controller.user.password = 'passFailTest';

                var expectedFailRequest = {
                    username: 'userFailTest',
                    password: 'passFailTest'
                };

                $httpBackend.when('POST', 'http://localhost:5000/login', expectedFailRequest)
                    .respond(401, 'Wrong user or password');

                controller.submit();
                $httpBackend.flush();
            });

            it('should show message in fail authentication', function() {
                expect(controller.message).toBe('Error: Invalid user or password');
            });

            it('should remove cookie in fail authentication', function() {
                expect($cookies.token).toBeUndefined();
            });
        });
    });

    describe('Logout', function() {
        it('should remove cookie when logout', function() {
            $cookies.token = 'tokenToRemove';

            controller.logout();

            expect($cookies.token).toBeUndefined();
        });
    });

    describe('AWS', function() {
        var $window;
        beforeEach(inject(function(_$window_) {
            $window = _$window_;
        }));

        it('should get object by key', function() {
            var url = 'http://www.google.com';
            $httpBackend.when('GET', 'http://localhost:5000/object/Gruntfile.js')
                .respond(201, url);

            spyOn($window, 'open').and.callFake(function() {
                return true;
            });

            controller.getObjectByKey();
            $httpBackend.flush();

            expect($window.open).toHaveBeenCalledWith(url);
        });

        it('should receive error response getting object by key', function() {
            $httpBackend.expectGET('http://localhost:5000/object/Gruntfile.js')
                .respond(401, 'Err');

            controller.getObjectByKey();
            $httpBackend.flush();
        });

        it('should receive success response getting all objects', function() {
            $httpBackend.expectGET('http://localhost:5000/object')
                .respond(201, 'Ok');

            controller.getAllObjects();
            $httpBackend.flush();
        });

        it('should receive error response getting all objects', function() {
            $httpBackend.expectGET('http://localhost:5000/object')
                .respond(401, 'Err');

            controller.getAllObjects();
            $httpBackend.flush();
        });
    });
});
