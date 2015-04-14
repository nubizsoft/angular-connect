angular.module('angular-connect')
    .factory('oauth2Strategy', function ($q, connect, connectStrategy) {

        var defaults = {
            redirectTo: ''
        };

        var oauth2Strategy = function (options) {

            this.name = 'oauth2';
        };

        oauth2Strategy.prototype = new connectStrategy();

        oauth2Strategy.prototype.login = function login(options) {

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

        return oauth2Strategy;

    });