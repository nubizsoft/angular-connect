angular.module('angular-connect')
    .factory('localStrategy', function cookiesStrategyProvider($q, connect, connectStrategy) {

        var defaults = {
            redirectTo: ''
        };

        var userPropertyName = connect.userPropertyName() || user;

        connect.serializeUser(function (user) {
            if (user) {
                localStorage[userPropertyName] = user;
            } else {
                localStorage.removeItem(userPropertyName);
            }
        });

        var localStrategy = function () {
            this.name = 'local';
        };

        localStrategy.prototype = new connectStrategy();

        localStrategy.prototype.login = function login(params, options) {

            options = options || {};
            options.redirectTo = options.redirectTo || defaults.redirectTo;

            return $q.when().then(function () {
                var deferred = $q.defer();

                var user = localStorage.getItem(userPropertyName);

                if (!user) {
                    deferred.reject({redirectTo: options.redirectTo});
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            });
        };

        return localStrategy;

    });