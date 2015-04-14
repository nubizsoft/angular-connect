angular.module('angular-connect-uiRouter', ['angular-connect', 'ui.router'])
    .service('uiRouterFramework', function ($rootScope, connect, $location, $q) {

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error.redirectTo !== undefined) {
                $rootScope.$evalAsync(function () {
                    $location.path(error.redirectTo);
                });
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('success');
        });

        return {
            login: function (name, options) {
                if (!angular.isArray(name)) {
                    name = [name];
                }

                var promise;

                angular.forEach(name, function (strategyName, index) {
                    if (index === 0) {
                        promise = $q.when(connect.strategy(strategyName).login(options));
                    } else {
                        promise = promise.catch(function () {
                            return connect.strategy(strategyName).login(options);
                        });
                    }
                });

                return promise;
            },

            logout: function (name, options) {
                if (!angular.isArray(name)) {
                    name = [name];
                }

                var promise;

                angular.forEach(name, function (strategyName, index) {
                    if (index === 0) {
                        promise = $q.when(connect.strategy(strategyName).logout(options));
                    } else {
                        promise = promise.catch(function () {
                            return connect.strategy(strategyName).logout(options);
                        });
                    }
                });

                return promise;
            }
        };

    });