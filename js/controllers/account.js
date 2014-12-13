app.controller('AccountController', ['$scope', '$rootScope', function(scope, root) {
	//VARIABLES
	scope.designs = [];
	scope.manufacturers = [];
	scope.products = [];

	//FUNCTIONS
	scope.get_designs = function() {
		var content = {
			filter: {
				user: root.user.user_id,
				active: 1
			},
			return: [
				'id',
				'created',
				'updated',
				'name',
				'product',
				'variations',
				'public'
			]
		};
		$.ajax({
			type: 'GET',
			url: 'php/designs.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				scope.designs = data;
				$.each(scope.designs, function(i, design) {
					design.variations = JSON.parse(design.variations);
				});
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get designs');
			}
		});
	};
	scope.get_designs();

	scope.get_manufacturer_names = function() {
		var content = {
			filter: {
				activated: 1
			},
			return: [
				'id',
				'name'
			]
		};
		$.ajax({
			type: 'GET',
			url: 'php/manufacturers.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				scope.manufacturers = {};
				$.each(data, function(i, manufacturer) {
					scope.manufacturers[manufacturer.id] = manufacturer;
				});
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get manufacturers');
			}
		});
	};
	scope.get_manufacturer_names();

	scope.get_product_names = function() {
		var content = {
			filter: {
				activated: 1
			},
			return: [
				'id',
				'name',
				'url',
				'manufacturer'
			]
		};
		$.ajax({
			type: 'GET',
			url: 'php/products.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				scope.products = {};
				$.each(data, function(i, product) {
					scope.products[product.id] = product;
				});
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get products');
			}
		});
	};
	scope.get_product_names();

}]);