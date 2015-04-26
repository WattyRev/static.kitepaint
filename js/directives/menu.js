app.directive('menu', function() {
	function link(scope, element, attrs) {
		scope.show = false;

		scope.change_password = function() {
			scope.$broadcast('change password');
		};
	}
	return {
		restrict: 'E',
		templateUrl: 'html/directives/menu.html',
		link: link
	};
});