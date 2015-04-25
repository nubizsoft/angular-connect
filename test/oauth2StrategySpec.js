'use strict';

describe('oauth2Strategy', function () {
    var $httpBackend,
        $window,
        element;

    beforeEach(function () {
        angular.module('angular-connect.test', {}).run(function ($q, connect, oauth2Strategy, alwaysStrategy, ngRouteFramework) {

            connect.framework(ngRouteFramework);
            connect.use(new oauth2Strategy({
                authorizationURL: 'http://auth.com/login',
                clientID: '124323423',
                redirectURL: 'http://toto',
                scope: 'all',
                responseType: 'code'
            }));

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
        $window = {location: {replace: jasmine.createSpy()}};

        module(function ($provide) {
            $provide.value('$window', $window);
        });
    });

    beforeEach(function () {
        module('angular-connect', 'angular-connect.test')
    });

    beforeEach(module(function ($routeProvider) {
        $routeProvider.when('/Login', {
            id: 'login'
        });

        $routeProvider.when('/Home', {
            id: 'home'
        })
    }));

    afterEach(inject(function (connect) {
        connect.logout();
    }));

    it('it should redirect to authorization Url', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure', {
                id: 'secure',
                resolve: {
                    isLogged: function (connect) {
                        return connect.login('oauth2');
                    }
                }
            });
        });

        inject(function ($route, $location, $rootScope, $compile) {
            $rootScope.$apply(function () {
                $location.path('/secure');
            });

            expect($window.location.replace).toHaveBeenCalled();
        });
    });

    it('it should validate code', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure/callback', {
                id: 'secure_callback',
                resolve: {
                    connect: function (connect) {
                        return connect.login('oauth2');
                    }
                }
            });
        });

        inject(function ($route, $location, $rootScope, $compile) {
            $rootScope.$apply(function () {
                $location.search({code: '1234'}).path('secure/callback');
            });

            expect($location.path()).toBe('/secure/callback');
        });
    });

    it('it should redirect to login if error occurred', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure/callback', {
                id: 'secure_callback',
                resolve: {
                    connect: function (connect) {
                        return connect.login('oauth2', {redirectTo: '/login'});
                    }
                }
            });
        });

        inject(function ($route, $location, $rootScope, $compile) {
            $rootScope.$apply(function () {
                $location.search({error: 'oauth2 error'}).path('secure/callback');
            });

            expect($location.path()).toBe('/login');
        });
    });
});