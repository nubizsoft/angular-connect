angular.module('angular-connect')
    .factory('ensureLoginStrategy', function ($q, connect, connectStrategy) {

        var defaults = {
            redirectTo: ''
        };

        var ensureLoginStrategy = function () {

            this.name = 'ensureLogin';
        };

        ensureLoginStrategy.prototype = new connectStrategy();

        ensureLoginStrategy.prototype.login = function login(options) {

            options = options || {};
            options.redirectTo =  options.redirectTo || defaults.redirectTo;

            return $q.when().then(function(){
                var deferred = $q.defer();

                if (!connect.isAuthenticated()){
                    deferred.reject({redirectTo: options.redirectTo});
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            });
        };

        return ensureLoginStrategy;
    });