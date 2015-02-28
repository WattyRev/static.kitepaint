app.controller('RetailersController', ['$scope', '$rootScope', '$state', function(scope, root, state) {

	//Variables
	scope.retailers = [];//raw retailers data
	scope.products = [];//products
	scope.display_retailers = []; //retailers data displayed
	scope.filtered_retailers = []; //filtered retailers
	scope.loading = false; //display loading text
	scope.query = ''; //search query
	scope.search = 'name'; //search parameter
	scope.num_display = 20; //number of retailers to display
	scope.sort = { //sorting setting
		metric: 'name',
		ascending: false
	};
	scope.show_edit = false;
	scope.editing = {};

	//retrieve retailers data
	scope.get_retailers = function() {
		scope.loading = true;
		var content = {
			return: [
				'id',
				'created',
				'updated',
				'name',
				'username',
				'city',
				'state',
				'email',
				'activated',
				'product_opt_out',
				'product_urls',
				'url',
				'image'
			]
		};
		$.ajax({
			type: 'GET',
			data: content,
			url: 'php/retailers.php',
			dataType: 'json',
			success: function(data) {
				$.each(data, function(i, retailer) {
					retailer.activated = retailer.activated === '1' ? true : false;
					retailer.product_opt_out = JSON.parse(retailer.product_opt_out);
					$.each(retailer.product_opt_out, function(id, value) {
						retailer.product_opt_out[id] = value === 'true' ? true : false;
					});
					retailer.product_urls = JSON.parse(retailer.product_urls);
				});
				scope.retailers = data;
				scope.filtered_retailers = data;
				scope.loading = false;
				scope.sort_retailers();
				scope.$apply();
				console.log(scope.retailers);
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get retailers');
			}
		});
	};
	scope.get_retailers();

	scope.get_products = function() {
		var content = {
			return: [
				'id',
				'name',
				'manufacturer'
			]
		};
		$.ajax({
			type: 'GET',
			url: 'php/products.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				scope.products = data;
				scope.$apply();
				console.log(scope.products);
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get products');
			}
		});
	};
	scope.get_products();

	//Filter retailers based on search using query
	scope.filter = function() {
		scope.filtered_retailers = [];
		$.each(scope.retailers, function(i, retailer) {
			if(retailer[scope.search].indexOf(scope.query) > -1) {
				scope.filtered_retailers.push(retailer);
			}
		});
		scope.sort_retailers();
	};

	//Put the first X num of retailers into the displayed table
	scope.update_retailers = function() {
		scope.display_retailers = [];
		for(var i = 0; i < scope.num_display && i < scope.filtered_retailers.length; i++) {
			scope.display_retailers.push(scope.filtered_retailers[i]);
		}
	};

	//sort array of users
	scope.sort_retailers = function() {
		scope.filtered_retailers.sort(function(a,b) {
			var metric = scope.sort.metric;
			var a_ = a[metric],
				b_ = b[metric];
			if (metric === 'created' || metric === 'updated'){
				a_ = new Date(a_);
				b_ = new Date(b_);
			}
			if (scope.sort.ascending) {
				if (a_ < b_)
					return -1;
				if (a_ > b_)
					return 1;
				return 0;
			} else {
				if (a_ < b_)
					return 1;
				if (a_ > b_)
					return -1;
				return 0;
			}
		});
		scope.update_retailers();
	};

	//set sorting parameters
	scope.sort_by = function(metric) {
		if(scope.sort.metric === metric) {
			scope.sort.ascending = !scope.sort.ascending;
		} else {
			scope.sort.metric = metric;
			if (metric === 'created' || metric === 'updated') {
				scope.sort.ascending = false;
			} else {
				scope.sort.ascending = true;
			}
		}
		scope.sort_retailers();
	};

	//show more rows of users
	scope.show_more = function() {
		scope.num_display += 20;
		scope.sort_retailers();
	};

	//set editing retailer and show edit retailer lightbox
	scope.edit_retailer = function(retailer) {
		scope.editing = JSON.parse(JSON.stringify(retailer));
		scope.show_edit = true;
	};

	//show blank edit window
	scope.add_retailer = function() {
		scope.editing = {
			new: true,
			activated: false
		};
		scope.editing.product_opt_out = {};
		$.each(scope.products, function(i, product) {
			scope.editing.product_opt_out[product.id] = false;
		});
		scope.editing.product_urls = {};
		$.each(scope.products, function(i, product) {
			scope.editing.product_urls[product.id] = '';
		});
		scope.show_edit = true;
	};

	//perform ajax post to save retailer data
	scope.save_retailer = function(retailer) {
		var submit = JSON.parse(JSON.stringify(retailer));
		submit.product_opt_out = JSON.stringify(submit.product_opt_out);
		submit.product_urls = JSON.stringify(submit.product_urls);
		console.log(submit);
		$.ajax({
			type: 'POST',
			url: 'php/retailers.php',
			data: retailer,
			dataType: 'json',
			success: function(data) {
				if (data.valid) {
					scope.get_retailers();
					scope.show_edit = false;
					scope.$apply();
				} else {
					console.log('error', data);
					scope.get_retailers();
					alert('Could not save retailer');
				}
			},
			error: function(data) {
				console.log('error', data);
				scope.get_retailers();
				alert('Could not save retailer');
			}
		});
	};

	//delete a retailer
	scope.delete_retailer = function(retailer) {
		var confirmed = confirm('Are you sure you want to delete ' + retailer.name + '?');
		if (confirmed) {
			$.ajax({
				type: 'POST',
				url: 'php/retailers.php',
				data: {id: retailer.id, delete: true},
				dataType: 'json',
				success: function(data) {
					scope.get_retailers();
					scope.show_edit = false;
					scope.$apply();
				},
				error: function(data) {
					console.log('error', data);
					scope.get_retailers();
					alert('Could not delete retailer');
				}
			});
		}
	};
}]);