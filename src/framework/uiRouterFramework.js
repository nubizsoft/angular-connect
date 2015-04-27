angular.module('angular-connect-uiRouter', ['angular-connect', 'ui.router'])
    .service('uiRouterFramework', function ($rootScope, $state, $stateParams, connect, $location, $q) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                console.log(JSON.stringify(fromState));
                //$rootScope.$returnTo = {state: toState, params: toParams};
            });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {

            $rootScope.$returnTo = {state: toState, params: toParams};

            if (error.redirectTo !== undefined) {
                console.log('redirectTo', error.redirectTo);
                $rootScope.$evalAsync(function () {
                    $state.go(error.redirectTo);
                    //$location.path(error.redirectTo);
                });
            }

        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            if ($rootScope.successReturnToOrRedirect){
                event.preventDefault();

                $rootScope.$evalAsync(function () {
                    $state.go($rootScope.$returnTo.state.name);
                });
            }
        });

        return {
            login: function (name, options) {
                if (!angular.isArray(name)) {
                    name = [name];
                }

                var promise;
                var params = $stateParams;
                angular.forEach(name, function (strategyName, index) {
                    if (index === 0) {
                        promise = $q.when(connect.strategy(strategyName).login(params, options));
                    } else {
                        promise = promise.catch(function () {
                            return connect.strategy(strategyName).login(params, options);
                        });
                    }
                    promise = promise.then(function success(result){

                        options = options || {};
                        if (options.successReturnToOrRedirect) {
                            $rootScope.successReturnToOrRedirect = options.successReturnToOrRedirect;
                        }
                    });
                });

                return promise;
            },

            logout: function (name, options) {
                if (!angular.isArray(name)) {
                    name = [name];
                }

                var promise;
                var params = $stateParams;

                angular.forEach(name, function (strategyName, index) {
                    if (index === 0) {
                        promise = $q.when(connect.strategy(strategyName).logout(params, options));
                    } else {
                        promise = promise.catch(function () {
                            return connect.strategy(strategyName).logout(params, options);
                        });
                    }
                });

                return promise;
            }
        };

    });