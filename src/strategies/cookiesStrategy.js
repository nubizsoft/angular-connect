angular.module('angular-connect')
    .provider('cookiesStrategy', function cookiesStrategyProvider() {

        var defaults = {
            redirectTo: ''
        };

        this.$get = function $get($q, $cookieStore, connect, connectStrategy) {

            connect.serializeUser(function(user){
                if (user) {
                    $cookieStore.put('user', user);
                } else {
                    $cookieStore.remove('user');
                }
            });

            var cookiesStrategy = function (options) {
                this.name = 'cookies';

                options = angular.extend({}, options, defaults);
                connectStrategy.call(options);
            };

            cookiesStrategy.prototype = new connectStrategy();

            cookiesStrategy.prototype.login = function login(params, options) {

                options = options || {};
                options.redirectTo =  options.redirectTo || defaults.redirectTo;

                return $q.when().then(function(){
                    var deferred = $q.defer();

                    var user = $cookieStore.get('user');

                    if (!user){
                        deferred.reject({redirectTo: options.redirectTo});
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                });
            };

            return cookiesStrategy;
        };

    });