angular.module('angular-connect')
    .factory('connectStrategy', function ($q) {

        var options = this.options = {};

        var connectStrategy = function (options) {
            this.options = options || {};
        };

        connectStrategy.prototype.login = function login() {
            return $q.when();
        };

        connectStrategy.prototype.logout = function logout() {
            return $q.when();
        };

        connectStrategy.prototype.serializeUser = function serializeUser() {
            return $q.when();
        };

        connectStrategy.prototype.deserializeUser = function serializeUser() {
            return $q.when();
        };

        return new connectStrategy();
    });