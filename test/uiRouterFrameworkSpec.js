describe("connect", function () {

    describe("uiRouterFramework", function () {


        beforeEach(function () {

            angular.module('angular-connect-uiRouter.test', ['angular-connect-uiRouter']).config(function($stateProvider){

                $stateProvider.state('success', {
                    url: 'success',
                    resolve: {
                        isConnected: function (connect) {
                            return connect.login('always');
                        }
                    }
                }).state('fail', {
                    url: 'fail',
                    resolve: {
                        isConnected: function (connect) {
                            console.log('fail');
                            return connect.login('fail');
                        }
                    }
                });
            }).run(function ($q, connect, failStrategy, alwaysStrategy, uiRouterFramework) {
                connect.framework(uiRouterFramework);
                connect.use ('fail', failStrategy);
                connect.use ('always', alwaysStrategy);

                alwaysStrategy.login.andCallFake(function () {
                    return $q.when().then(function () {
                        return $q.when({name: 'toto'})
                    })
                });

                failStrategy.login.andCallFake(function () {
                    return $q.reject('fail');
                });
            });

            module('angular-connect-uiRouter.test', {
                alwaysStrategy: jasmine.createSpyObj('alwaysStrategy', ['login']),
                failStrategy: jasmine.createSpyObj('failStrategy', ['login'])
            });


        });

        it('it should redirect to root', function () {
            inject(function ($route, $location, $rootScope, $compile, $state) {
                $rootScope.$apply(function () {
                    $state.go('fail');
                });

                console.log($location.path());

                expect($location.path()).toBe('');
            });
        });

        it('it should continue', function () {
            inject(function ($route, $location, $rootScope, $state) {
                $rootScope.$apply(function () {
                    $state.go('success');
                });

                console.log($location.path());

                expect($location.path()).toBe('/success');
            });
        });



    });
})
;