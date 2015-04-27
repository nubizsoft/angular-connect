angular.module('angular-connect')
    .factory('connectStrategy', function ($q) {

        var options = this.options = {};
        var connectStrategy = function (options, verify) {
            this.options = options || {};
            this.verify = verify;
        };

        connectStrategy.prototype.login = function login(params, options) {
            return $q.when();
        };

        connectStrategy.prototype.logout = function logout(params, options) {
            return $q.when();
        };

        connectStrategy.prototype.serializeUser = function serializeUser() {
            return $q.when();
        };

        connectStrategy.prototype.deserializeUser = function serializeUser() {
            return $q.when();
        };

        return connectStrategy;
    });