app.directive('stateOptions', function() {
	function link(scope, element, attrs) {
		scope.model = attrs.model;
	}
	return {
		restrict: 'A',
		templateUrl: 'html/directives/state_options.html',
		link: link
	};
});