'use strict';

describe('ensureLogoutStrategy', function () {
    var $httpBackend,
        element;

    beforeEach(function () {
        angular.module('angular-connect.test', {}).run(function ($q, connect, ensureLogoutStrategy, alwaysStrategy, ngRouteFramework) {

            connect.framework(ngRouteFramework);
            connect.use(new ensureLogoutStrategy());

            alwaysStrategy.login.andCallFake(function () {
                return $q.when().then(function () {
                    return $q.when({name: 'toto'})
                })
            })
            connect.use('always', alwaysStrategy);
        });
    });

    beforeEach(module('angular-connect.test', {
        alwaysStrategy: jasmine.createSpyObj('alwaysStrategy', ['login']),
        failStrategy: jasmine.createSpyObj('failStrategy', ['login'])
    }));

    beforeEach(function () {
        module('angular-connect', 'angular-connect.test')
    });

    beforeEach(module(function ($routeProvider) {
        $routeProvider.when('/Login', {
            id: 'login',
            resolve: {
                connect: function (connect) {
                    return connect.logout('ensureLogout');
                }
            }
        });

        $routeProvider.when('/secure', {
            id: 'secure',
            resolve: {
                connect: function (connect) {
                    return connect.login('always');
                }
            }
        });

        $routeProvider.when('/Home', {
            id: 'home'
        })
    }));

    afterEach(inject( function (connect){
        connect.logout();
    }));

    it('it should redirect to root', function () {

        inject(function ($route, $location, $rootScope, $compile, connect) {
            $rootScope.$apply(function () {
                $location.path('/secure');
            });
            expect($location.path()).toBe('/secure');

            $rootScope.$apply(function () {
                $location.path('/Login');
            });
            expect($location.path()).toBe('/');
        });
    });

    it('it should continue to login route', function () {

        inject(function ($route, $location, $rootScope, $compile) {
            $rootScope.$apply(function () {
                $location.path('/Login');
            });
            expect($location.path()).toBe('/Login');

        });
    });
});