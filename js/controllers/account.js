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
				'active': '1',
				'user' : root.user.user_id
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
				root.done(3);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not retrieve designs. Try again later.');
				root.done(3);
				root.$apply();
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
				root.done(3);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not retrieve manufacturers. Try again later.');
				root.done(3);
				root.$apply();
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
				root.done(3);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not retrieve products. Try again later.');
				root.done(3);
				root.$apply();
			}
		});
	};

	scope.check_user = function() {
		if (!root.user) {
			root.error('You must be logged in to view this page.');
			root.$apply();
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
				if (data.changed) {
					root.user.email = new_email;
					scope.show_change_email = false;
					root.success('Your email address has been changed');
				} else {
					root.error(data.message);
				}
				scope.$apply();
			},
			error: function(data) {
				root.error('We could not change your email address. Try again later.');
				root.$apply();
			}
		});
	};

	scope.change_first_name = function(new_first_name) {
		var content = {
			id: root.user.user_id,
			first_name: new_first_name
		};
		$.ajax({
			type: 'POST',
			url: 'php/users.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				if (data.valid) {
					root.user.first_name = new_first_name;
					scope.show_change_first_name = false;
					root.success('Your first name has been changed');
				} else {
					root.error(data.message);
				}
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('We could not change your first name. Try again later.');
				root.$apply();
			}
		});
	};

	scope.change_last_name = function(new_last_name) {
		var content = {
			id: root.user.user_id,
			last_name: new_last_name
		};
		$.ajax({
			type: 'POST',
			url: 'php/users.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				if (data.valid) {
					root.user.last_name = new_last_name;
					scope.show_change_last_name = false;
					root.success('Your last name has been changed');
				} else {
					root.error(data.message);
				}
				scope.$apply();
			},
			error: function(data) {
				root.error('We could not change your last name. Try again later.');
				root.$apply();
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
				if (data.changed) {
					localStorage.user = '';
					root.user = null;
					state.go('home');
					root.success('Your account has been deleted.');
				} else {
					console.log('error', data);
					root.error(data.message);
				}
				root.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('We could not delete your account. Try again later.');
				root.$apply();
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
				scope.show_delete_design = false;
				scope.deleting_design = null;
				scope.get_designs();
				root.success('Your design has been deleted');
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.show_delete_design = false;
				scope.deleting_design = null;
				scope.get_designs();
				root.error('We could not delete your design. Try again later.');
				scope.$apply();
			}
		});
	};

	scope.show_share = function(design) {
		root.share_design = design;
		root.show_share = true;
	};

	//LISTENERS
	root.$on('share_set_public', function() {
		scope.get_designs();
	});

}]);