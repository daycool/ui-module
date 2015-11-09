define('user/UserInfoCtrl', [], function() {
    return function(app, elem, attrs, scope) {
        app.controller('UserInfoCtrl', ['$http', '$rootScope', '$scope', 'UserInfoService', function($http, $rootScope, $scope, UserInfoService) {
            
            var data = $scope.data = {
                id: '123',
                userName: 'daycool',
                userAge: '26',
            };



            $scope.submit = function(e){
               
            }
            
        }]);

    }
});