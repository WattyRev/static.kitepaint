app.controller('EditController', ['$scope', '$rootScope', '$location', '$state', function(scope, root, location, state) {
	scope.current_color = '#ffffff';
	scope.product = {};
	scope.colors = [];
	scope.variations = [];
	scope.loading = true;
	scope.show_settings = false;
	scope.show_outlines = true;
	scope.public = false;
	console.log(state);

	//FUNCTIONS
	scope.get_product = function() {
		scope.loading = true;
		$.ajax({
			type: 'GET',
			url: 'php/products.php?id=' + location.$$search.id,
			dataType: 'json',
			success: function(data) {
				scope.product = data[0];
				scope.colors = JSON.parse(scope.product.colors);
				scope.variations = JSON.parse(scope.product.variations);
				scope.current_variation = scope.variations[0];
				scope.loading = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get product');
			}
		});
	};
	if (state.params.type === 'new') {
		scope.get_product();
	}

	scope.get_design = function() {

	};
	if (state.params.type === 'saved') {
		scope.get_design();
	}

	scope.color_panel = function(colors, $event) {
		var panel = $($event.target),
			can_color = true;

		if (colors !== 'all') {
			var current_name;

			can_color = false;
			colors = colors.split(', ');

			$.each(scope.colors, function(i, color) {
				if (color.color === scope.current_color) {
					current_name = color.name;
					return false;
				}
			});

			$.each(colors, function(i, color) {
				if (current_name === color) {
					can_color = true;
					return false;
				}
			});
		}

		if (can_color) {
			panel.attr('fill', scope.current_color);
			$.each(scope.variations, function(i, variation) {
				if (variation.name === scope.current_variation.name) {
					variation.svg = $('.template').html();
					return false;
				}
			});
		}
	};

	scope.color_group = function(colors, $event) {
		var group = $($event.target).parents('g'),
			can_color = true;

		if (colors !== 'all') {
			var current_name;

			can_color = false;
			colors = colors.split(', ');

			$.each(scope.colors, function(i, color) {
				if (color.color === scope.current_color) {
					current_name = color.name;
					return false;
				}
			});

			$.each(colors, function(i, color) {
				if (current_name === color) {
					can_color = true;
					return false;
				}
			});
		}

		if (can_color){
			group.find('*').attr('fill', scope.current_color);
			$.each(scope.variations, function(i, variation) {
				if (variation.name === scope.current_variation.name) {
					variation.svg = $('.template').html();
					return false;
				}
			});	
		}
	};

	scope.change_color = function(color) {
		scope.current_color = color;
	};

	scope.select_variation = function(variation) {
		scope.current_variation = {};
		scope.current_variation = variation;
	};

	scope.autofill = function() {
		var layout = {};
		//create array of autofill panels and colors
		$.each($('.template svg *[ng-click]'), function(i, elem) {
			var elem = $(elem),
				item = elem.attr('data-autofill'),
				color;

			if (item[0] === 'g') {
				color = $(elem.children()[0]).attr('fill') || '#FFFFFF';
			} else {
				color = elem.attr('fill');
			}
			layout[item] = color;
		});

		//loop through visible variations and update html
		$.each($('.variations .variation'), function(i, elem) {
			var variation = $(elem);

			//loop through autofill array and set colors
			$.each(layout, function(item, color){
				if (item[0] === 'g') {
					variation.find('*[data-autofill="' + item + '"]').children().attr('fill', color);
				} else {
					variation.find('*[data-autofill="' + item + '"]').attr('fill', color);
				}

			});
		});
		//Update scope.variations
		$.each(scope.variations, function(i, variation) {
			var html = $('.variation[title="' + variation.name + '"]').html();
			scope.variations[i].svg = html;
		});
	};

	scope.save_as = function() {
		scope.saving = true;
		var design = {
			name: scope.save_as_name,
			user: root.user.user_id,
			product: scope.product.id,
			variations: JSON.stringify(scope.variations),
			public: scope.public ? 1 : 0,
			new: 1
		};

		$.ajax({
			type: 'POST',
			url: 'php/designs.php',
			data: design,
			dataType: 'json',
			success: function(data) {
				console.log('success', data);
				scope.edit_design(data.id);
				scope.saving = false;
				scope.show_save_as = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not save design');
				scope.saving = false;
				scope.show_save_as = false;
				scope.$apply();
			}
		});
	};

	scope.edit_design = function(id) {
		var params = {type:'saved', id:id};
 		state.go('edit', params);
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