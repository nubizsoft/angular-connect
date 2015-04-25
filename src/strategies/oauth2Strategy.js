angular.module('angular-connect')
    .factory('oauth2Strategy', function ($q, connect, connectStrategy) {

        var oauth2Strategy = function (options) {

            this.name = 'oauth2';
            connectStrategy.call(this, options);
        };

        oauth2Strategy.prototype = new connectStrategy();

        oauth2Strategy.prototype.login = function login(params, options) {
            var self = this;
            // callback with code or token
            if (params && (params.code || params.token)) {
                return this.validate(params).then(function(){
                    return self.promise;
                }).catch(function (error) {
                    var err = angular.extend({}, error, {
                        redirectTo: options.redirectTo || this.options.redirectTo
                    });
                    return $q.reject(err);
                });
            }

            // callback with an error
            if (params && params.error) {
                return $q.reject({
                    redirectTo: options.redirectTo || this.options.redirectTo,
                    error: params.error,
                    error_description: params.error_description,
                    error_uri: params.error_uri
                });
            }

            var query = queryString.stringify({
                client_id: this.options.clientID,
                redirect_uri: this.options.redirectURL,
                scope: this.options.scope,
                response_type: this.options.responseType
            });

            var url = this.options.authorizationURL + '?' + query;

            return $q.reject({redirectExt: url});
        };

        oauth2Strategy.prototype.validate = function validate(params) {
            return $q.when(params);
        };

        return oauth2Strategy;

    });