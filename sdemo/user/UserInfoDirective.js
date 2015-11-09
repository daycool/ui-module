define('user/UserInfoDirective', [
	'text!user/UserInfoDirective.html',
], function(html) {
	return function(app, elem, attrs, scope) {
		app.directive('UserInfoDirective', [function() {
			return {
				template: html,
				restrict: 'EA',
				replace: true,
				link: function postLink(scope, element, attrs) {
					element.on('click', function(){
						alert('测试指令成功');
					});
				}
			};
		}]);
	}
});