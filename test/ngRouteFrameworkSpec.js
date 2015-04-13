describe("connect", function () {

    describe("ngRouteFramework", function () {


        beforeEach(function () {

            var mockedStrategies = {};

            angular.module('angular-connect.test', function () {
            }).config(function($routeProvider){

                $routeProvider.when('/success', {
                    id: 'success',
                    resolve: {
                        isConnected: function (connect) {
                            return connect.login('always');
                        }
                    }
                });

                $routeProvider.when('/fail', {
                    id: 'fail',
                    resolve: {
                        isConnected: function (connect) {
                            return connect.login('fail');
                        }
                    }
                });
            }).run(function ($q, connect, failStrategy, alwaysStrategy, ngRouteFramework) {
                connect.framework(ngRouteFramework);
                connect.use ('fail', failStrategy);
                connect.use ('always', alwaysStrategy);

                alwaysStrategy.login.andCallFake(function () {
                    return $q.when().then(function () {
                        return $q.when({name: 'toto'})
                    })
                });

                failStrategy.login.andCallFake(function () {
                    return $q.reject({redirectTo:'/'});
                });
            });

            module('angular-connect.test', {
                alwaysStrategy: jasmine.createSpyObj('alwaysStrategy', ['login']),
                failStrategy: jasmine.createSpyObj('failStrategy', ['login'])
            });

            module('angular-connect', 'angular-connect.test');
        });

        it('it should redirect to root', function () {
            inject(function ($route, $location, $rootScope, $compile) {
                $rootScope.$apply(function () {
                    $location.path('/fail');
                });

                console.log($location.path());

                expect($location.path()).toBe('/');
            });
        });

        it('it should continue', function () {
            inject(function ($route, $location, $rootScope, $compile) {
                $rootScope.$apply(function () {
                    $location.path('/success');
                });

                console.log($location.path());

                expect($location.path()).toBe('/success');
            });
        });



    });
})
;