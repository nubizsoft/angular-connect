angular.module('angular-connect')
    .service('ngrouteFramework', function ($rootScope, connect, $location, $q) {

        $rootScope.$on('$routeChangeError', function(event, next, current, error){
            if (error.redirectTo !== 'undefined'){
                console.log('redirectTo');
                event.preventDefault();
                $rootScope.$evalAsync(function(){
                    $location.path(error.redirectTo);
                });
            }
        });

        $rootScope.$on('$routeChangeSuccess', function(event, next, current, error){
            console.log('success', error);
        });

        return {
            login: function (name, options) {
                if (connect.isAuthenticated()) {
                    return $q.when(connect.user());
                } else {
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
                }
            },

            logout: function (name, options) {
                if (!connect.isAuthenticated()) {
                    return $q.when(connect.user());
                } else {
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
            }
        };

    });