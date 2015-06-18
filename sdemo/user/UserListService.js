define('user/UserListService', [], function() {
    return function(app, elem, attrs, scope) {
        app.factory('UserListService', ['$rootScope', '$http', function($rootScope, $http) {
            var urlMaps = {
                getList: '/user/getList'
            };
            return {
                getList: function(opts) {
                    opts.url = urlMaps.getList;
                    return $http(opts);                     
                }
            };
        }]);
    }
});