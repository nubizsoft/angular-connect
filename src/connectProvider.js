angular.module('angular-connect')

    .provider('connect', function connectProvider() {
        var _userPropertyName = 'user',
            _strategies = {},
            _serializers = [],
            _framework = null;

        this.userPropertyName = function userPropertyName(name) {
            if (arguments.length > 0) {
                if (!angular.isString(name)) {
                    throw Error('userPropertyName should be a string');
                }

                _userPropertyName = name;
                return this;
            } else {
                return _userPropertyName;
            }
        };


        /**
         * @ngdoc object
         * @name angular-connect.connect
         *
         * @description
         *
         */
        this.$get = function $get($rootScope, $q) {
            return {
                login: function login(name, options) {
                    if (_framework == null) {
                        throw new Error('Framework is not defined');
                    }
                    console.log("connectInstance:login");
                    return _framework.login(name, options)
                        .then(function resolve(user) {
                            console.log("connectInstance:login:resolve");
                            $rootScope[_userPropertyName] = user;

                            var map = _serializers.map(function (serializer) {
                                return $q.when(user).then(serializer);
                            });

                            return $q.all(map);
                        });
                },

                logout: function login(name, options) {
                    if (_framework == null) {
                        throw new Error('Framework is not defined');
                    }

                    return $q.when(name).then(function (name) {
                        if (name) {
                            console.log(name);
                            return _framework.logout(name, options);
                        }
                    }).then(function resolve() {
                        delete $rootScope[_userPropertyName];

                        var map = _serializers.map(function (serializer) {
                            return $q.when().then(serializer);
                        });

                        return $q.all(map);
                    });
                },

                framework: function framework(value) {
                    _framework = value;
                    return this;
                },

                user: function user() {
                    return $rootScope[_userPropertyName];
                },

                use: function use(name, strategy) {
                    if (!strategy) {
                        strategy = name;
                        name = strategy.name;
                    }

                    if (!name) {
                        throw new Error('Authentication strategy must have a name');
                    }
                    _strategies[name] = strategy;
                    return this;
                },

                strategy: function strategy(name) {
                    var str = _strategies[name];
                    if (!str) {
                        throw new Error('Unknown identification strategy "' + name + '"');
                    }

                    return str;
                },

                unuse: function unuse(name) {
                    delete _strategies[name];
                    return this;
                },

                serializeUser: function serializeUser(fn) {
                    _serializers.push(fn);
                },

                isAuthenticated: function isAuthenticated() {
                    return ($rootScope[_userPropertyName]) ? true : false;
                },

                userPropertyName: function userPropertyName(){
                    return _userPropertyName;
                }
            };
        };
    });