var connectFiles = {
    src: [
        'src/module.js',
        'src/connectProvider.js',
        'src/strategies/connectStrategy.js',
        'src/strategies/localStrategy.js',
        'src/strategies/cookiesStrategy.js',
        'src/strategies/oauth2Strategy.js',
        'src/strategies/sessionStrategy.js',
        'src/strategies/ensureLoginStrategy.js',
        'src/strategies/ensureLogoutStrategy.js',
        'src/framework/ngRouteFramework.js',
        'src/framework/uiRouterFramework.js'
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
                'lib/query-string/query-string.js',
                'lib/angular/angular.js',
                'lib/ui-router/release/angular-ui-router.js',
                'lib/angular-route/angular-route.js',
                'lib/angular-mocks/angular-mocks.js',
                'lib/angular-cookies/angular-cookies.js'
            ]
        }
    }
};

if (exports) {
    exports.files = connectFiles;
}