app.controller('EmbedsController', ['$scope', '$rootScope', '$state', function(scope, root, state) {
	scope.products = [];
	scope.manufacturers = [];
	scope.custom = {
		width: 900,
		height: 900
	};
	scope.embed_url = '';
	scope.iframe_width = '100%';
	scope.iframe_height = '900px';

	scope.get_products = function() {
		var data = {
			filter:{activated: 1},
			return: [
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
				$.each(data, function(i, product) {
					product.id = parseInt(product.id);
					product.manufacturer = parseInt(product.manufacturer);
				});
				data.sort(function(a,b) {
					if(a.manufacturer > b.manufacturer) {
						return 1;
					} else if(a.manufacturer < b.manufacturer) {
						return -1;
					} else {
						if(a.name > b.name) {
							return 1;
						} else if (a.name < b.name) {
							return -1;
						} else {
							return 0;
						}
					}
				});
				scope.products = data;
				scope.$apply();
			}
		});
	};
	scope.get_products();

	scope.get_manufacturers = function() {
		var data = {
			filter:{activated: 1},
			return: [
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
			}
		});
	};
	scope.get_manufacturers();

	scope.generate_embed_code = function() {
		if(!scope.embed_url) {
			scope.embed_code = '';
		}
		scope.embed_code = '<iframe width="' + scope.iframe_width + '" height="' + scope.iframe_height + '" src="' + scope.embed_url + '" frameborder="0"></iframe>';

	};

	//listeners 
	scope.$watch('product', function(id) {
		if(id){
			scope.embed_url = root.base_url + '/?embed=1&id=' + id + '#!/edit/new?id=' + id;
			scope.generate_embed_code();
		}
	});
	scope.$watch('custom_size', function(size) {
		if(size !== undefined) {
			if(!size) {
				scope.iframe_width = '100%';
				scope.iframe_height = '900px';
			} else {
				scope.iframe_width = scope.custom.width + 'px';
				scope.iframe_height = scope.custom.height + 'px';
			}
			scope.generate_embed_code();
		}
	});
	scope.$watch('custom', function(custom) {
		if(scope.custom_size) {
			scope.iframe_width = custom.width + 'px';
			scope.iframe_height = custom.height + 'px';
			scope.generate_embed_code();
		}
	}, true);
}]);