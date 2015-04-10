app.controller('OrdersController', ['$scope', '$rootScope',
	function(scope, root) {

		//variables
		scope.raw_orders = [];
		scope.orders = [];
		scope.users = {};
		scope.products = {};
		scope.manufacturers = {};
		scope.finished_calls = 0;
		scope.show = 25;
		scope.sort_by = 'created';
		scope.sort_direction = 'descending';
		scope.design_image = '';
		scope.search_by = 'user';
		scope.search = '';

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
			scope.all_orders = [];
			$.each(raw, function(i, order) {
				scope.all_orders.push({
					created: order.created,
					designs: order.designs,
					id: order.id,
					name: order.name,
					product: scope.manufacturers[scope.products[order.product].manufacturer] + ' ' + scope.products[order.product].name,
					user: scope.users[order.user]
				});
			});
			scope.search_orders();
			scope.$apply();
		};

		scope.search_orders = function() {
			if(!scope.search) {
				scope.filtered_orders = JSON.parse(JSON.stringify(scope.all_orders));
				scope.display();
				return;
			}
			scope.filtered_orders = [];
			if(scope.search_by === 'created' || scope.search_by === 'product' || scope.search_by === 'name') {
				$.each(scope.all_orders, function(i, order) {
					if(order[scope.search_by].toLowerCase().indexOf(scope.search.toLowerCase()) > -1) {
						scope.filtered_orders.push(order);
					}
				});
			} else if (scope.search_by === 'user') {
				$.each(scope.all_orders, function(i, order) {
					if(
						(order.user.first_name.toLowerCase() + ' ' + order.user.last_name.toLowerCase() + ' (' + order.user.username.toLowerCase() + ')').indexOf(scope.search.toLowerCase()) > -1
					) {
						scope.filtered_orders.push(order);
					}
				});
			} else if (scope.search_by === 'email') {
				$.each(scope.all_orders, function(i, order) {
					if(order.user.email.toLowerCase().indexOf(scope.search.toLowerCase()) > -1) {
						scope.filtered_orders.push(order);
					}
				});
			}
			scope.sort();
		};

		scope.sort = function(clicked) {
			if(clicked) {
				if(scope.sort_by === clicked) {
					if(scope.sort_direction === 'ascending') {
						scope.sort_direction = 'descending';
					} else {
						scope.sort_direction = 'ascending';
					}
				} else {
					scope.sort_by = clicked;
					scope.sort_direction = 'descending';
				}

			}
			scope.filtered_orders.sort(function(a,b) {
				if(scope.sort_by === 'created' || scope.sort_by === 'product' || scope.sort_by === 'name'){
					if(scope.sort_direction === 'ascending') {
						if(a[scope.sort_by] < b[scope.sort_by]) {
							return 1;
						} else if(a[scope.sort_by] > b[scope.sort_by]) {
							return -1;
						}
						return 0;
					} else {
						if(a[scope.sort_by] < b[scope.sort_by]) {
							return -1;
						} else if(a[scope.sort_by] > b[scope.sort_by]) {
							return 1;
						}
						return 0;
					}
				} else if(scope.sort_by === 'email'){
					if(scope.sort_direction === 'ascending') {
						if(a.user.email < b.user.email) {
							return 1;
						} else if(a.user.email > b.user.email) {
							return -1;
						}
						return 0;
					} else {
						if(a.user.email < b.user.email) {
							return -1;
						} else if(a.user.email > b.user.email) {
							return 1;
						}
						return 0;
					}
				} else if(scope.sort_by === 'user'){
					var a_user = a.user.first_name + ' ' + a.user.last_name + ' (' + a.user.username + ')';
					var b_user = b.user.first_name + ' ' + b.user.last_name + ' (' + b.user.username + ')';
					if(scope.sort_direction === 'ascending') {
						if(a_user < b_user) {
							return 1;
						} else if(a_user > b_user) {
							return -1;
						}
						return 0;
					} else {
						if(a_user < b_user) {
							return -1;
						} else if(a_user > b_user) {
							return 1;
						}
						return 0;
					}
				}
			});
			scope.display();
		};

		scope.display = function() {
			scope.orders = [];
			$.each(scope.filtered_orders, function(i, order) {
				if(i < scope.show){
					scope.orders.push(order);
				}
			});
		};

		scope.show_image = function(design){
			scope.design_image = scope.convert_to_png(design.svg);
		};

		scope.convert_to_png = function(svg) {
			var find = 'mesh"',
				regex = new RegExp(find, 'g'),
				processed_svg = svg.replace(regex, 'mesh" fill="rgba(50,50,50,.5)"'),
				svg_data = 'data:image/svg+xml;base64,' + btoa(processed_svg);
			canvg('canvas', svg_data);
			return document.getElementsByTagName("canvas")[0].toDataURL("image/png");
		};
	}
]);