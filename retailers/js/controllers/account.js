app.controller('AccountController', ['$scope', '$rootScope', '$state', '$location', function(scope, root, state, location) {
	//variables
	scope.edit_variables = {};
	scope.saving = false;

	//functions
	scope.update_retailer = function() {
		var data = {
			filter: {
				id: scope.id
			},
			return: [
				'id',
				'name',
				'username',
				'first_name',
				'last_name',
				'url', 
				'city',
				'state',
				'email',
				'phone',
				'image',
				'product_opt_out',
				'product_urls',
				'activated',
				'actcode'
			]
		};
		$.ajax({
			type: 'GET',
			url: '../php/retailers.php',
			dataType: 'json',
			data: data,
			success: function(data) {
				data[0].product_opt_out = JSON.parse(data[0].product_opt_out);
				data[0].product_urls = JSON.parse(data[0].product_urls);
				root.retailer =  data[0];
				scope.$apply();
			}
		});
	};
	scope.update_retailer();

	scope.check_upload_response = function() {
		var search = location.$$search;
		if(search.success) {
			root.success('Image successfully changed.');
			location.url(location.path());
			return;
		}
		if(search.error) {
			var error = search.error.replace(/_/g, ' ');
			root.error(error);
			location.url(location.path());
			return;
		}
	};
	scope.check_upload_response();

	scope.change = {
		password: function() {
			var data = {
				change_password: true,
				id: root.retailer.id,
				old_password: scope.edit_variables.old_password,
				password: scope.edit_variables.password,
				confirm_password: scope.edit_variables.confirm_password
			};
			if(data.password !== data.confirm_password) {
				root.error('Passwords do not match');
				return;
			}
			save(data, function(data) {
				if(!data.valid) {
					fail_save('password');
					return;
				}
				scope.edit_variables = JSON.parse(JSON.stringify(root.retailer));
				scope.edit = '';
				root.success('Your password has been changed');
				root.$apply();
			}, function(data) {
				fail_save('password');
			});
		},
		contact_name: function() {
			var data = {
				change_contact_name: true,
				id: root.retailer.id,
				first_name: scope.edit_variables.first_name,
				last_name: scope.edit_variables.last_name
			};
			save(data, function(data) {
				if(!data.valid) {
					console.log('error', data);
					root.error(data.message || 'Unable to change name. Try again later.');
					root.$apply();
					return;
				}
				root.retailer.first_name = scope.edit_variables.first_name;
				root.retailer.last_name = scope.edit_variables.last_name;
				scope.edit = '';
				root.success('Your name has been changed');
				root.$apply();
			},function(data) {
				console.log('error', data);
				root.error('Unable to change name. Try again later.');
				root.$apply();
			});
		},
		email: function() {
			var data = {
				change_email: true,
				id: root.retailer.id,
				password: scope.edit_variables.email_password,
				email: scope.edit_variables.email
			};
			save(data, function(data) {
				if(!data.valid) {
					fail_save('email_address');
					return;
				}
				root.retailer.email = scope.edit_variables.email;
				scope.edit = '';
				root.success('Your email address has been changed');
				root.$apply();
			}, function(data) {
				fail_save('email address');
			});
		},
		phone: function() {
			var data = {
				change_phone: true,
				id: root.retailer.id,
				phone: scope.edit_variables.phone
			};
			save(data, function(data) {
				if(!data.valid) {
					fail_save('phone number');
					return;
				}
				root.retailer.phone = scope.edit_variables.phone;
				scope.edit = '';
				root.success('Your phone number has been changed');
				root.$apply();
			}, function(data) {
				fail_save('phone number');
			});
		},
		name: function() {
			var data = {
				change_name: true,
				id: root.retailer.id,
				name: scope.edit_variables.name
			};
			save(data, function(data) {
				if(!data.valid) {
					fail_save('business name');
					return;
				}
				root.retailer.name = scope.edit_variables.name;
				scope.edit = '';
				root.success('Your business name has been changed');
				root.$apply();
			}, function(data) {
				fail_save('business name');
			});
		},
		location: function() {
			var data = {
				change_location: true,
				id: root.retailer.id,
				city: scope.edit_variables.city,
				state: scope.edit_variables.state
			};
			save(data, function(data) {
				if(!data.valid) {
					fail_save('location');
					return;
				}
				root.retailer.city = scope.edit_variables.city;
				root.retailer.state = scope.edit_variables.state;
				scope.edit = '';
				root.success('Your location has been changed');
				root.$apply();
			}, function(data) {
				fail_save('location');
			});
		},
		url: function() {
			var data = {
				change_url: true,
				id: root.retailer.id,
				url: scope.edit_variables.url
			};
			save(data, function(data) {
				if(!data.valid) {
					fail_save('website');
					return;
				}
				root.retailer.url = scope.edit_variables.url;
				scope.edit = '';
				root.success('Your website has been changed');
				root.$apply();
			}, function(data) {
				fail_save('website');
			});
		}
	};
	
	function save(data, success, error) {
		scope.saving = true;
		$.ajax({
			url: '../php/retailers.php',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(data) {
				scope.saving = false;
				success(data);
			},
			error: function(data) {
				scope.saving = false;
				error(data);
			}
		});
	}
	function fail_save(item) {
		console.log('error', data);
		root.error('Unable to change ' + item + '. Try again later.');
		root.$apply();
	}
	
	//listeners
	root.$watch('retailer', function(retailer) {
		if(retailer) {
			scope.edit_variables = JSON.parse(JSON.stringify(retailer));
		}
	});
}]);