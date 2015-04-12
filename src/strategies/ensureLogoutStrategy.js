angular.module('angular-connect')
    .factory('ensureLogoutStrategy', function ($q, connect, connectStrategy) {

        var defaults = {
            redirectTo: ''
        };

        var ensureLogoutStrategy = function () {
            this.name = 'ensureLogout';
        };

        ensureLogoutStrategy.prototype = new connectStrategy();

        ensureLogoutStrategy.prototype.logout = function logout(options) {

            console.log('ensureLogoutStrategy:logout');

            options = options || {};
            options.redirectTo =  options.redirectTo || defaults.redirectTo;

            return $q.when().then(function(){
                var deferred = $q.defer();
                if (connect.isAuthenticated()){
                    console.log('ensureLogoutStrategy:logout:reject');
                    deferred.reject({redirectTo: options.redirectTo});
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            });
        };

        return ensureLogoutStrategy;
    });