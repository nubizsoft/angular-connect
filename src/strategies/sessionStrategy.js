angular.module('angular-connect')
    .factory('sessionStrategy', function cookiesStrategyProvider($q, connect, connectStrategy) {

        var defaults = {
            redirectTo: ''
        };

        connect.serializeUser(function (user) {
            if (user) {
                sessionStorage.user = user;
            } else {
                sessionStorage.removeItem('user');
            }
        });

        var sessionStrategy = function () {
            this.name = 'session';
        };

        sessionStrategy.prototype = connectStrategy;

        sessionStrategy.prototype.login = function login(options) {

            options = options || {};
            options.redirectTo = options.redirectTo || defaults.redirectTo;

            return $q.when().then(function () {
                var deferred = $q.defer();

                var user = sessionStorage.getItem('user');

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