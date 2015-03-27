app.controller('AccountController', ['$scope', '$rootScope', '$state', function(scope, root, state) {
	//variables
	scope.edit_variables = {};

	//functions
	function save(data, success, error) {
		$.ajax({
			url: '../php/retailers.php',
			type: 'post',
			dataType: 'json',
			data: data,
			success: success,
			error: error
		});
	}
	scope.test = function() {
		console.log('test');
	};
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
					console.log('error', data);
					root.error(data.message || 'Unable to change password. Try again later.');
					root.$apply();
					return;
				}
				scope.edit_variables = JSON.parse(JSON.stringify(root.retailer));
				scope.edit = '';
				root.success('Your password has been changed');
				root.$apply();
			}, function(data) {
				console.log('error', data);
				root.error('Unable to change password. Try again later.');
				root.$apply();
			});
		},
		contact_name: function() {

		},
		email: function() {

		},
		phone: function() {

		},
		name: function() {

		},
		location: function() {

		},
		website: function() {

		}
	};
	console.log(scope);
	
	//listeners
	root.$watch('retailer', function(retailer) {
		if(retailer) {
			scope.edit_variables = JSON.parse(JSON.stringify(retailer));
		}
	});
}]);