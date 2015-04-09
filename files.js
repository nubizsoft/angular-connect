var connectFiles = {
    src: [
        'src/module.js',
        'src/connectProvider.js',
        'src/strategies/connectStrategy.js',
        'src/strategies/localStorageStrategy.js',
        'src/strategies/ensureLoginStrategy.js',
        'src/strategies/ensureLogoutStrategy.js',
        'src/framework/ngrouteFramework.js'
    ],
    testUtils: [
        'test/testUtils.js'
    ],
    test: [
        'test/*Spec.js'
    ],
    angular: function (version) {
        if (version) {
            return [
                'lib/angular-' + version + '/angular.js',
                'lib/angular-' + version + '/angular-mocks.js'
            ]
        }
        else {
            return [
                'lib/angular/angular.js',
                'lib/angular-route/angular-route.js',
                'lib/angular-mocks/angular-mocks.js'
            ]
        }
    }
};

if (exports) {
    exports.files = connectFiles;
}