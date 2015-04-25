angular.module('angular-connect')
    .factory('sessionStrategy', function cookiesStrategyProvider($q, connect, connectStrategy) {

        var defaults = {
            redirectTo: ''
        };

        var userPropertyName = connect.userPropertyName() || user;

        connect.serializeUser(function (user) {
            if (user) {
                sessionStorage[userPropertyName] = user;
            } else {
                sessionStorage.removeItem(userPropertyName);
            }
        });

        var sessionStrategy = function () {
            this.name = 'session';
        };

        sessionStrategy.prototype = new connectStrategy();

        sessionStrategy.prototype.login = function login(params, options) {

            options = options || {};
            options.redirectTo = options.redirectTo || defaults.redirectTo;

            return $q.when().then(function () {
                var deferred = $q.defer();

                var user = sessionStorage.getItem(userPropertyName);

                if (!user) {
                    deferred.reject({redirectTo: options.redirectTo});
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            });
        };

        return sessionStrategy;

    });