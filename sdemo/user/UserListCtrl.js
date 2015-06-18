define('user/UserListCtrl', [], function() {
    return function(app, elem, attrs, scope) {
        app.controller('UserListCtrl', ['$http', '$rootScope', '$scope', 'UserListService', function($http, $rootScope, $scope, UserListService) {

            var data = $scope.data = {
                users: [
                    {id: '1', userName: 'qian1', userAge: '21'},
                    {id: '2', userName: 'qian2', userAge: '22'},
                    {id: '3', userName: 'qian3', userAge: '23'},
                    {id: '4', userName: 'qian4', userAge: '24'},
                    {id: '5', userName: 'qian5', userAge: '25'},
                    {id: '6', userName: 'qian6', userAge: '26'},
                ]
            };

            $scope.delete = function(index){
                data.users.splice(index, 1);
            }


        }]);        

    }
});