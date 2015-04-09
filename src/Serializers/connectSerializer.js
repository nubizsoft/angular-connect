angular.module('angular-connect')
    .factory('connectSerializer', function () {

        var options = this.options = {};

        var connectSerializer = function (options) {
            this.options = options;
        };

        connectSerializer.prototype.write = function serialize(user, options) {
            throw new Error('serialize must be overridden');
        };

        connectSerializer.prototype.read = function deserialize() {
            throw new Error('serialize must be overridden');
        };

        return connectSerializer;
    });