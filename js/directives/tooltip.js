app.directive('tooltip', function() {
	function link(scope, element, attrs) {
		scope.content = attrs.content;
		if (scope.content === 'username' ) {
			scope.content = '3-30 chars, a-z, A-Z, 0-9'
		} else if (scope.content === 'password') {
			scope.content = '6-15 chars, a-z, A-Z, 0-9, symbols(#@*)'
		}
		scope.show_tip = false;
	};
	return {
		restrict: 'E',
		templateUrl: 'html/directives/tooltip.html',
		scope: {
			content: '='
		},
		link: link,
	};
});