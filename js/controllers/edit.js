app.controller('EditController', ['$scope', '$rootScope', '$location', function(scope, root, location) {
	scope.current_color = '#ffffff';
	scope.product = {};
	scope.colors = [];
	scope.variations = [];
	scope.loading = true;

	//FUNCTIONS
	scope.get_product = function() {
		scope.loading = true;
		$.ajax({
			type: 'GET',
			url: 'php/products.php?id=' + location.$$search.id,
			dataType: 'json',
			success: function(data) {
				scope.product = data[0];
				scope.colors = JSON.parse(scope.product.colors);
				scope.variations = JSON.parse(scope.product.variations);
				scope.loading = false;
				console.log(scope.product);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get product');
			}
		});
	};
	scope.get_product();

	scope.color_panel = function(colors, $event) {
		console.log('test');
		var panel = $($event.target);
		panel.css('fill', scope.current_color);
	};

	scope.color_group = function() {
	};

	scope.change_color = function(color) {
		scope.current_color=color;
	};
}]);