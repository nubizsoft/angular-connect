describe("connect", function () {

    describe("provider", function () {
        var provider;

        beforeEach(function () {
            angular.module('angular-connect.test', function () {
            }).config(function (connectProvider) {
                provider = connectProvider;
            });

            module('angular-connect', 'angular-connect.test');
        });

        afterEach(function () {
            provider = null;
        });

        it("should have default userPropertyName", inject(function () {
            expect(provider.userPropertyName()).toBe('user');
        }));

        it("should change userPropertyName", inject(function () {
            var propertyName = 'userName'
            provider.userPropertyName(propertyName);
            expect(provider.userPropertyName()).toBe(propertyName);
        }));

        it("should throw an error", inject(function () {
                expect(function () {
                    provider.userPropertyName({'toto': 'toto'});
                }).toThrow('userPropertyName should be a string');
                expect(function () {
                    provider.userPropertyName(0);
                }).toThrow('userPropertyName should be a string');
            }
        ));
    });

    describe("service", function () {
        var callback;

        beforeEach(function () {

            var mockedStrategies = {};

            angular.module('angular-connect.test', function () {
            }).config(function (connectProvider) {
                provider = connectProvider;
            });

            module('angular-connect.test', {
                fakeStrategy: jasmine.createSpyObj('fakeStrategy', ['name']),
                fakeStrategyWithoutName: jasmine.createSpy('fakeStrategyWithoutName'),
                alwaysStrategy: jasmine.createSpyObj('alwaysStrategy', ['login'])
            });

            module('angular-connect', 'angular-connect.test');
            callback = jasmine.createSpy('callback');
        });

        afterEach(function () {
            provider = null;
        });

        it("should use a strategy with default name", inject(function (connect, fakeStrategy) {
            expect(connect.use(fakeStrategy)).toBe(connect);
        }));

        it("should use a strategy with specified name", inject(function (connect, fakeStrategy) {
            expect(connect.use('fakeStrategy', fakeStrategy)).toBe(connect);
        }));

        it("should throw error without name", inject(function (connect, fakeStrategyWithoutName) {
            expect(function () {
                connect.use(fakeStrategyWithoutName);
            }).toThrow('Authentication strategy must have a name');
        }));

        it("should unuse a strategy", inject(function (connect) {
            expect(connect.unuse('fakeStrategy')).toBe(connect);
        }));

        it("should have an empty user", inject(function (connect) {
            expect(connect.user()).toBeUndefined();
        }));

        it("should login a user", function () {
            inject(function ($rootScope, $q, connect, alwaysStrategy, ngRouteFramework) {
                var user = {name: 'toto'}

                alwaysStrategy.name = 'always';
                alwaysStrategy.login.andCallFake(function () {
                    return $q.when(user);
                })

                connect.use(alwaysStrategy);
                connect.framework(ngRouteFramework);

                connect.login('always').then(function success() {
                    expect(connect.user()).toBe(user);
                    expect(connect.isAuthenticated()).toBe(true);
                })

                $rootScope.$apply();

            });
        });

        it("should logout a user", inject(function (connect, ngRouteFramework) {
            connect.framework(ngRouteFramework);
            connect.logout();
            expect(connect.user()).toBeUndefined();
            expect(connect.isAuthenticated()).toBe(false);
        }));


    });
})
;