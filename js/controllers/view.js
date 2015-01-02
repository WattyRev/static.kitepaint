app.controller('ViewController', ['$scope', '$rootScope', '$location', function(scope, root, location) {
	scope.product = {};
	scope.design = {};
	scope.variations = [];
	scope.loading = true;
	scope.show_settings = false;
	scope.show_outlines = true;
	scope.background = '';

	//FUNCTIONS
	scope.get_product = function() {
		scope.loading = true;
		var id = scope.design.product;
		
		$.ajax({
			type: 'GET',
			url: 'php/products.php?id=' + id,
			dataType: 'json',
			success: function(data) {
				scope.product = data[0];
				scope.colors = JSON.parse(scope.product.colors);
				scope.loading = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get product');
			}
		});
	};

	scope.get_design = function() {
		scope.loading = true;
		$.ajax({
			type: 'GET',
			url: 'php/designs.php?id=' + location.$$search.id,
			dataType: 'json',
			success: function(data) {
				scope.design = data[0];
				console.log(scope.design);
				scope.variations = JSON.parse(scope.design.variations);
				scope.current_variation = scope.variations[0];
				console.log(scope.design.public);
				scope.public = scope.design.public === '1' ? true : false;
				scope.$apply();
				scope.get_product();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get design');
			}
		});
	};
	scope.get_design();

	scope.select_variation = function(variation) {
		scope.current_variation = {};
		scope.current_variation = variation;
	};

	//Close dropdown when clicking out of it
	$(document).click(function(e) {
		var elem = $(e.target);
		if (!elem.parents('.settings-button').length && !elem.hasClass('settings-button') && scope.show_settings) {
			scope.show_settings = false;
			scope.$apply();
		}
	});

}]);