app.controller('AccountController', ['$scope', '$rootScope', '$state', function(scope, root, state) {
	//VARIABLES
	scope.designs = [];
	scope.manufacturers = [];
	scope.products = [];
	scope.deleting_design = {};
	scope.show_delete_design = false;

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
			],
			order: ['id', 'DESC']
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
					$.each(design.variations, function(i, variation) {
						if (variation.primary) {
							design.primary = variation;
						}
					});
				});
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get designs');
			}
		});
	};

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

	scope.check_user = function() {
		if (!root.user) {
			root.error('You must be logged in to view this page.');
			state.go('home');
		} else {
			scope.get_designs();
			scope.get_manufacturer_names();
			scope.get_product_names();
		}
	};
	scope.check_user();

	scope.change_email = function(new_email) {
		var content = {
			id: root.user.user_id,
			email: new_email
		};
		$.ajax({
			type: 'POST',
			url: 'php/change_email.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				console.log(data.changed);
				if (data.changed) {
					root.user.email = new_email;
					scope.show_change_email = false;
					scope.$apply();
				} else {
					console.log(data);
					alert(data.message);
				}
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not change email');
			}
		});
	};

	scope.delete_account = function() {
		var content = {
			id: root.user.user_id,
			password: scope.delete_account_password
		};
		$.ajax({
			type: 'POST',
			url: 'php/delete_account.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				console.log(data);
				if (data.changed) {
					localStorage.user = '';
					root.user = null;
					state.go('home');
				} else {
					console.log(data);
					alert(data.message);
				}
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not delete account');
			}
		});
	};

	scope.delete_design = function(design) {
		if (!scope.show_delete_design) {
			scope.show_delete_design = true;
			scope.deleting_design = design.id;
			return;
		}
		var data = {
			delete: true,
			id: scope.deleting_design
		};
		$.ajax({
			type: 'POST',
			url: 'php/designs.php',
			data: data,
			dataType: 'json',
			success: function(data) {
				console.log('success', data);
				scope.show_delete_design = false;
				scope.deleting_design = null;
				scope.get_designs();
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not delete design');
				scope.show_delete_design = false;
				scope.deleting_design = null;
				scope.get_designs();
				scope.$apply();
			}
		});
	};

	scope.show_share = function(design) {
		root.share_design = design.id;
		root.show_share = true;
	};

}]);