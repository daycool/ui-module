define('user/UserInfoService', [], function() {
    return function(app, elem, attrs, scope) {
        app.factory('UserInfoService', ['$rootScope', '$http', function($rootScope, $http) {
            var urlMaps = {
                UserInfo: '/user/login',
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