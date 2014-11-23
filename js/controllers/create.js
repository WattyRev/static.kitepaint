app.controller('CreateController', ['$scope', '$rootScope', function(scope, root) {

	//VARIABLES

	scope.products = [];
	scope.filtered_products = [];
	scope.loading = true;

	//FUNCTIONS
	scope.get_products = function() {
		scope.loading = true;
		$.ajax({
			type: 'GET',
			url: 'php/products.php?activated=1',
			dataType: 'json',
			success: function(data) {
				scope.products = data;
				scope.filtered_products = data;
				scope.loading = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get products');
			}
		});
	};
	scope.get_products();

}]);