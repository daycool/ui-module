define('user/LoginService', [], function() {
    return function(app, elem, attrs, scope) {
        app.factory('LoginService', ['$rootScope', '$http', function($rootScope, $http) {
            var urlMaps = {
                login: '/user/login',
            };
            return {
                login: function(opts) {
                    opts.url = urlMaps.login;
                    return $http(opts);                     
                },
            };
        }]);
    }
});