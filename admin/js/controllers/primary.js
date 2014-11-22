app.controller('PrimaryController', ['$scope', '$rootScope', '$state', function(scope, root, state) {

	//VARIABLES
	scope.current_page = '';

	//FUNCITIONS
	//close lightbox
	$(document).click(function(e) {
		if ($(e.target).hasClass('lightbox')) {
			$(e.target).find('.close').click();
		}
	})

	//LISTENERS
	//Update current page data
	root.$on('$stateChangeStart', function(event, toState) {
		scope.current_page = toState;
	});
}]);