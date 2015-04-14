angular.module('angular-connect')
    .factory('facebookStrategy', function ($q, connect, oauth2Strategy) {

        var defaults = {
            redirectTo: ''
        };

        var facebookStrategy = function (options) {

            this.name = 'facebook';

            oauth2Strategy.call(this, options);
        };

        facebookStrategy.prototype = new oauth2Strategy();

        facebookStrategy.prototype.login = function login(options) {

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

        return facebookStrategy;

    });