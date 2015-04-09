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
            console.log("connectStrategy:logout");
            return $q.when();
        };

        return new connectStrategy();
    });