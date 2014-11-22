app.controller('ActivateController', ['$scope', '$rootScope', '$location', function(scope, root, location) {
	//VARIABLES
		scope.activated = 'activating';
		scope.activate_data = {
			uid: location.search().uid,
			actcode: location.search().actcode
		};

	//FUNCTIONS
		scope.activate = function() {
			$.ajax({
				type: 'POST',
				url: 'php/activate.php',
				data: scope.activate_data,
				dataType: 'json',
				success: function(data) {
					console.log('success', data);
					if (data.activated) {
						scope.activated = 'activated';
					} else {
						scope.activated = 'invalid';
					}
					scope.$apply();
				},
				error: function(data) {
					console.log('error', data);
					scope.activated = 'invalid';
					scope.$apply();
				}
			});
		}
		scope.activate();

}]);