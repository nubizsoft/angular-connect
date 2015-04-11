angular.module('angular-connect')
    .factory('localStorageStrategy', function ($q, connectProvider, connectStrategy) {

        var localStorageStrategy = function (options) {
            connectStrategy.apply(this, options);

            this.name = 'session';

            connectProvider.serializeUser(function(user){

            });
        };

        localStorageStrategy.prototype = new connectStrategy();

        localStorageStrategy.prototype.login = function authenticate() {
            var deferred = $q.defer();

            //window.localStorage.getItem()

            return deferred.promise;
        };

        return localStorageStrategy();
    });
