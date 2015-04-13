'use strict';

describe('localStrategy', function () {
    var $httpBackend,
        element;

    beforeEach(function () {
        angular.module('angular-connect.test', {}).run(function ($q, connect, localStrategy, alwaysStrategy, ngRouteFramework) {

            connect.framework(ngRouteFramework);
            connect.use(new localStrategy());

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
            id: 'login'
        });

        $routeProvider.when('/Home', {
            id: 'home'
        })
    }));

    afterEach(inject(function (connect) {
        connect.logout();
    }));

    it('it should redirect to root', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure', {
                id: 'secure',
                resolve: {
                    isLogged: function (connect) {
                        return connect.login('local');
                    }
                }
            });
        });

        inject(function ($route, $location, $rootScope, $compile) {
            $rootScope.$apply(function () {
                $location.path('/secure');
            });

            expect($location.path()).toBe('/');
        });
    });
    it('it should redirect to login form', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure', {
                id: 'secure',
                resolve: {
                    connect: function (connect) {
                        return connect.login('local', {redirectTo: '/login'});
                    }
                }
            });
        });

        inject(function ($route, $location, $rootScope, $compile) {
            $rootScope.$apply(function () {
                $location.path('/secure');
            });

            expect($location.path()).toBe('/login');
        });
    });

    it('it should continue to secure if logged before', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure', {
                id: 'secure',
                resolve: {
                    connect: function (connect) {
                        return connect.login('local', {redirectTo: '/login'});
                    }
                }
            })
                .when('/authenticate', {
                    id: 'authenticate',
                    resolve: {
                        connect: function (connect) {
                            return connect.login('always');
                        }
                    }
                });
        });

        inject(function ($route, $location, $rootScope, $compile, connect) {
            $rootScope.$apply(function () {
                $location.path('/authenticate');
            });
            expect($location.path()).toBe('/authenticate');

            //connect.logout();

            $rootScope.$apply(function () {
                $location.path('/secure');
            });

            expect($location.path()).toBe('/secure');
        });
    });

    it('it should redirect after logout', function () {

        module(function ($routeProvider) {
            $routeProvider.when('/secure', {
                id: 'secure',
                resolve: {
                    connect: function (connect) {
                        return connect.login('local', {redirectTo: '/login'});
                    }
                }
            })
                .when('/authenticate', {
                    id: 'authenticate',
                    resolve: {
                        connect: function (connect) {
                            return connect.login('always');
                        }
                    }
                });
        });

        inject(function ($route, $location, $rootScope, $compile, connect) {
            $rootScope.$apply(function () {
                $location.path('/authenticate');
            });
            expect($location.path()).toBe('/authenticate');

            connect.logout();

            $rootScope.$apply(function () {
                $location.path('/secure');
            });

            expect($location.path()).toBe('/login');
        });
    });
});