app.controller('OrdersController', ['$scope', '$rootScope',
	function(scope, root) {

		//variables
		scope.raw_orders = [];
		scope.orders = [];
		scope.users = {};
		scope.products = {};
		scope.manufacturers = {};
		scope.finished_calls = 0;

		//functions
		scope.get = {
			orders: function() {
				var data = {
					filter: {
						retailer: root.retailer.id,
					},
					return :[
						'id',
						'user',
						'product',
						'name',
						'designs',
						'created'
					]
				};
				$.ajax({
					type: 'GET',
					url: '../php/orders.php',
					dataType: 'json',
					data: data,
					success: function(data) {
						$.each(data, function(i, order) {
							order.designs = JSON.parse(order.designs);
							order.id = parseInt(order.id);
							order.product = parseInt(order.product);
							order.user = parseInt(order.user);
						});
						scope.raw_orders = data;
						scope.$apply();
						scope.parse_data();
						console.log('orders', scope.raw_orders);
					},
					error: function(data) {
						console.error('error', data);
					}
				});
			},
			users: function() {
				var data = {
					filter: {
						activated: 1
					},
					return :[
						'first_name',
						'last_name',
						'email',
						'username',
						'loginid'
					]
				};
				$.ajax({
					type: 'GET',
					url: '../php/users.php',
					dataType: 'json',
					data: data,
					success: function(data) {
						scope.users = {};
						$.each(data, function(i, user) {
							user.loginid = parseInt(user.loginid);
							scope.users[user.loginid] = user;
						});
						scope.$apply();
						scope.parse_data();
						console.log('users', scope.users);
					},
					error: function(data) {
						console.error('error', data);
					}
				});
			},
			products: function() {
				var data = {
					filter: {
						activated: 1
					},
					return :[
						'id',
						'name',
						'manufacturer'
					]
				};
				$.ajax({
					type: 'GET',
					url: '../php/products.php',
					dataType: 'json',
					data: data,
					success: function(data) {
						scope.products = {};
						$.each(data, function(i, product) {
							product.id = parseInt(product.id);
							product.manufacturer = parseInt(product.manufacturer);
							scope.products[product.id] = product;
						});
						scope.$apply();
						scope.parse_data();
						console.log('products', scope.products);
					},
					error: function(data) {
						console.error('error', data);
					}
				});
			},
			manufacturers: function() {
				var data = {
					filter: {
						activated: 1
					},
					return :[
						'id',
						'name'
					]
				};
				$.ajax({
					type: 'GET',
					url: '../php/manufacturers.php',
					dataType: 'json',
					data: data,
					success: function(data) {
						var manufacturers = {};
						$.each(data, function(i, manufacturer) {
							manufacturers[manufacturer.id] = manufacturer.name;
						});
						scope.manufacturers = manufacturers;
						console.log('manufacturers', scope.manufacturers);
						scope.$apply();
						scope.parse_data();
					},
					error: function(data) {
						console.error('error', data);
					}
				});
			}
		};
		$.each(scope.get, function(i, go) {
			go();
		}); 
		scope.parse_data = function() {
			scope.finished_calls++;
			if(scope.finished_calls < 4) {
				return;
			}
			var raw = JSON.parse(JSON.stringify(scope.raw_orders));
			$.each(raw, function(i, order) {
				
			});
		};
	}
]);