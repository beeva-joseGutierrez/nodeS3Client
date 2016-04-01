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

    describe('login', function() {
        describe('login successful', function() {
            var expectedRequest;
            beforeEach(function() {
                controller.user.username = 'userTest';
                controller.user.password = 'passTest';

                expectedRequest = {
                    username: 'userTest',
                    password: 'passTest'
                };
            });

            it('should send username and password to server', function() {
                $httpBackend.expectPOST('http://localhost:5000/login', expectedRequest).respond(201, 'Ok');

                controller.submit();
                $httpBackend.flush();
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
    });
});
