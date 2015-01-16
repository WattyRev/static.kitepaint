app.controller('ViewController', ['$scope', '$rootScope', '$location', function(scope, root, location) {
	scope.product = {};
	scope.design = {};
	scope.variations = [];
	scope.show_settings = false;
	scope.show_outlines = true;
	scope.background = '';
	scope.user = {};

	//FUNCTIONS
	scope.get_product = function() {
		var id = scope.design.product;
		
		$.ajax({
			type: 'GET',
			url: 'php/products.php?id=' + id,
			dataType: 'json',
			success: function(data) {
				scope.product = data[0];
				scope.colors = JSON.parse(scope.product.colors);
				root.done(3);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get product');
				root.done(3);
				scope.$apply();
			}
		});
	};

	scope.get_user = function() {
		var request = {
			filter: {
				loginid: scope.design.user
			},
			return: [
				'username'
			]
		};
		$.ajax({
			type: 'GET',
			url: 'php/users.php',
			data: request,
			dataType: 'json',
			success: function(data) {
				scope.design.user = {
					id: scope.design.user,
					username: data[0].username
				};
				root.done(3);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not get user');
				root.done(3);
				scope.$apply();
			}
		});
	};

	scope.get_design = function() {
		$.ajax({
			type: 'GET',
			url: 'php/designs.php?id=' + location.$$search.id,
			dataType: 'json',
			success: function(data) {
				scope.design = data[0];
				scope.variations = JSON.parse(scope.design.variations);
				scope.current_variation = scope.variations[0];
				scope.public = scope.design.public === '1' ? true : false;
				root.done(3);
				scope.$apply();
				scope.get_product();
				scope.get_user();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get design');
				root.done(1);
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