app.controller('ProductsController', ['$scope', '$rootScope', function(scope, root) {
	//Variables
	scope.products = [];//raw products data
	scope.display_products = []; //products data displayed
	scope.filtered_products = []; //filtered products
	scope.loading = false; //display loading text
	scope.query = ''; //search query
	scope.search = 'name'; //search parameter
	scope.num_display = 20; //number of products to display
	scope.sort = { //sorting setting
		metric: 'created',
		ascending: false
	};
	scope.show_edit = false;
	scope.editing = {};
	scope.colors = [{
		name: '',
		color: ''
	}];
	scope.variations = [{
		name: '',
		svg: ''
	}];
	
	//Functions

	//retrieve products data
	scope.get_products = function() {
		scope.loading = true;
		var content = {
			return: [
				'id',
				'name',
				'manufacturer',
				'created',
				'colors',
				'variations',
				'url',
				'activated',
				'notes',
				'embed'
			]
		};
		$.ajax({
			type: 'GET',
			url: 'php/products.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				scope.products = data;
				$.each(scope.products, function(i, product) {
					product.activated = product.activated === '0' ? false : true;
				});
				scope.filtered_products = data;
				scope.loading = false;
				scope.sort_products();
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get products');
			}
		});
	};
	scope.get_products();

	//Filter products based on search using query
	scope.filter = function() {
		scope.filtered_products = [];
		$.each(scope.products, function(i, product) {
			if(product[scope.search].indexOf(scope.query) > -1) {
				scope.filtered_products.push(product);
			}
		});
		scope.sort_products();
	};

	//Put the first X num of products into the displayed table
	scope.update_products = function() {
		scope.display_products = [];
		for(var i = 0; i < scope.num_display && i < scope.filtered_products.length; i++) {
			scope.display_products.push(scope.filtered_products[i]);
		}
	};

	//sort array of products
	scope.sort_products = function() {
		scope.filtered_products.sort(function(a,b) {
			var metric = scope.sort.metric;
			var a_ = a[metric],
				b_ = b[metric];
			if (metric === 'created'){
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
		scope.update_products();
	};

	//set sorting parameters
	scope.sort_by = function(metric) {
		if(scope.sort.metric === metric) {
			scope.sort.ascending = !scope.sort.ascending;
		} else {
			scope.sort.metric = metric;
			if (metric === 'created') {
				scope.sort.ascending = false;
			} else {
				scope.sort.ascending = true;
			}
		}
		scope.sort_products();
	};

	//show more rows of products
	scope.show_more = function() {
		scope.num_display += 20;
		scope.sort_products();
	};

	//set editing product and show edit product lightbox
	scope.edit_product = function(product) {
		scope.editing = JSON.parse(JSON.stringify(product));
		scope.colors = [{
			name: '',
			color: ''
		}];
		scope.variations = [{
			name: '',
			svg: ''
		}];
		scope.notes = [''];
		if (product.colors) {
			scope.colors = JSON.parse(product.colors);
		}
		if (product.variations) {
			scope.variations = JSON.parse(product.variations);
		}
		if (product.notes) {
			scope.notes = JSON.parse(product.notes);
		}
		scope.show_edit = true;
	};

	//show blank edit window
	scope.add_product = function() {
		scope.editing = {
			new: true
		};
		scope.show_edit = true;
	};

	//perform ajax post to save product data
	scope.save_product = function(product) {
		//stringify stuff
		product.colors = JSON.stringify(scope.colors);
		product.variations = JSON.stringify(scope.variations);
		product.notes = JSON.stringify(scope.notes);

		$.ajax({
			type: 'POST',
			url: 'php/products.php',
			data: product,
			dataType: 'json',
			success: function(data) {
				scope.get_products();
				scope.show_edit = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.get_products();
				alert('Could not save product');
			}
		});
	};

	//delete a product
	scope.delete_product = function(product) {
		var confirmed = confirm('Are you sure you want to delete ' + product.name + '?');
		if (confirmed) {
			$.ajax({
				type: 'POST',
				url: 'php/products.php',
				data: {id: product.id, delete: true},
				dataType: 'json',
				success: function(data) {
					scope.get_products();
					scope.show_edit = false;
					scope.$apply();
				},
				error: function(data) {
					console.log('error', data);
					scope.get_products();
					alert('Could not delete product');
				}
			});
		}
	};

	//add color
	scope.add_color = function() {
		var color = {
			name: '',
			color: ''
		};
		scope.colors.push(color);
	};

	//remove color
	scope.remove_color = function(index) {
		scope.colors.splice(index,1);
	};

	//add variation
	scope.add_variation = function() {
		var variation = {
			name: '',
			svg: ''
		};
		scope.variations.push(variation);
	};

	//remove variation
	scope.remove_variation = function(index) {
		scope.variations.splice(index,1);
	};

	//add note
	scope.add_note = function() {
		var note = '';
		scope.notes.push(note);
	};

	//remove note
	scope.remove_note = function(index) {
		scope.notes.splice(index,1);
	};

}]);