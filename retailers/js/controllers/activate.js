app.controller('ActivateController', ['$scope', '$rootScope', '$location', '$state', function(scope, root, location, state) {

	//variables
	scope.page = 1;
	scope.id = location.$$search.id;
	scope.actcode = location.$$search.actcode;
	scope.retailer = {};

	//functions
	scope.get_retailer = function() {
		var data = {
			filter: {
				id: scope.id
			},
			return: [
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
				scope.retailer =  data[0];
				scope.check_status();
				scope.$apply();
			},
			error: function(data) {
				root.error('Could not get information. Try again later.');
				console.log('error', data);
			}
		});
	};
	scope.get_retailer();

	scope.check_status = function() {
		if(scope.actcode !== scope.retailer.actcode) {
			state.go('login');
			root.error('Invalid activation code');
		}
		if(scope.retailer.activated === '1') {
			state.go('login');
			root.success('Your account is already activated. Please log in.');
		}
	};

	scope.save_info = function() {
		if (scope.retailer.password !== scope.retailer.confirm_password) {
			root.error('Passwords do not match');
			return;
		}
		$.ajax({
			type: 'POST',
			data: scope.retailer,
			dataType: 'json',
			url: '../php/retailers.php',
			success: function(data) {
				scope.page = 2;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Unable to save. Try again later.');
				scope.$apply();
			}
		});
	};
}]);