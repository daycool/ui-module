define('user/LoginCtrl', [], function() {
    return function(app, elem, attrs, scope) {
        app.controller('LoginCtrl', ['$http', '$rootScope', '$scope', 'LoginService', function($http, $rootScope, $scope, LoginService) {
            $scope.moduleScope = {
                'data.userName': 'userName',
                'data.userPass': 'userPass',
            };

            var data = $scope.data = {
                userName: 'qian',
                userPass: '',
            };

            $scope.submit = function(e){
                var reqData = data || {};
                reqData.e = e.currentTarget;
                
                LoginService.add(reqData)
                .success(function(resData){
                    if(resData.apistatus === 1){

                    }else{
                        console.log('加载失败');
                    }
                }).error(function(resData){
                    console.log('请求失败');
                });
            }

            
        }]);

    }
});