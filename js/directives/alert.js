app.directive('alert', function() {
	function link(scope, element, attrs) {
		//VARIABLES
		scope.show = false;
		scope.timer = null;

		//FUNCTIONS
		scope.show_alert = function() {
			if (scope.timer) {
				clearTimeout(scope.timer);
			}
			scope.show = true;
			scope.timer = setTimeout(function() {
				scope.show = false;
				scope.$apply();
				setTimeout(function() {
					root.alert_content = {};
					root.$apply();
				}, 400);
			}, 5 * 1000);
		};

		//LISTENERS
		root.$watch('alert_content', function(content) {
			if (content && content.type && content.message) {
				if (content.confirm) {
					scope.show_alert_confirm();
					return;
				}
				scope.show_alert();
				return;
			} else {
				if (content.type || content.message) {
					root.alert_content = {};
				}
				return;
			}
		});
	}
	return {
		restrict: 'E',
		templateUrl: 'html/directives/alert.html',
		link: link
	};
});