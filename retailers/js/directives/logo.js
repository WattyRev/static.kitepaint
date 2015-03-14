app.directive('logo', function() {
	function link(scope, element, attrs) {
	}
	return {
		restrict: 'E',
		templateUrl: 'html/directives/logo.html',
		link: link
	};
});