app.controller('EditController', ['$scope', '$rootScope', '$location', '$state', '$sce', function(scope, root, location, state, sce) {
	scope.current_color = '#ffffff';
	scope.current_color_style = {'background-color' : '#ffffff'};
	scope.product = {};
	scope.design = {};
	scope.colors = [];
	scope.variations = [];
	scope.loading = true;
	scope.show_settings = false;
	scope.show_outlines = true;
	scope.show_reset = false;
	scope.public = false;
	scope.background = '';

	//FUNCTIONS
	scope.get_product = function() {
		scope.loading = true;
		var id;
		if (state.params.type === 'new') {
			id = location.$$search.id;
		} else {
			id = scope.design.product;
		}
		$.ajax({
			type: 'GET',
			url: 'php/products.php?id=' + id,
			dataType: 'json',
			success: function(data) {
				scope.product = data[0];
				//process colors
				scope.colors = JSON.parse(scope.product.colors);
				//process notes
				scope.notes = JSON.parse(scope.product.notes);
				if (state.params.type === 'new') {
					//process variations
					scope.variations = JSON.parse(scope.product.variations);
					$.each(scope.variations, function(i, variation) {
						if (i < 1) {
							variation.primary = true;
						} else {
							variation.primary = false;
						}
					});
					scope.current_variation = scope.variations[0];
				}
				scope.loading = false;
				root.done(1);
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not get product');
				root.done(1);
				scope.$apply();
			}
		});
	};
	if (state.params.type === 'new') {
		scope.get_product();
	}

	scope.get_design = function() {
		scope.loading = true;
		$.ajax({
			type: 'GET',
			url: 'php/designs.php?id=' + location.$$search.id,
			dataType: 'json',
			success: function(data) {
				scope.design = data[0];
				if (scope.design.active === '0') {
					root.error('Design does not exist');
					state.go('home');
					return;
				}
				if (scope.design.user !== root.user.user_id) {
					var params = {type:'new', id:scope.design.product};
 					state.go('edit', params);
				}
				scope.variations = JSON.parse(scope.design.variations);
				scope.current_variation = scope.variations[0];
				scope.public = scope.design.public === '1' ? true : false;
				if (root.editing_share) {
					scope.show_share();
				}
				scope.$apply();
				scope.get_product();
				root.done(2);
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not get design');
				root.done(1);
				scope.$apply();
			}
		});
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
		scope.current_color_style = {'background-color' : color};
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
			elem = $(elem);
			var item = elem.attr('data-autofill'),
				color;

			if (item === undefined) {
				return false;
			}
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

	scope.fn_show_save_as = function() {
		scope.show_save_as = true;
		scope.show_login = false;
	};

	scope.save_as = function() {
		scope.saving = true;
		var user_ud,
			public;
		if (root.no_account) {
			user_id = 0;
			public = true;
		} else {
			user_id = root.user.user_id;
			public = scope.public;
		}

		var design = {
			name: scope.save_as_name,
			user: user_id,
			product: scope.product.id,
			variations: JSON.stringify(scope.variations),
			public: public ? 1 : 0,
			new: 1
		};

		$.ajax({
			type: 'POST',
			url: 'php/designs.php',
			data: design,
			dataType: 'json',
			success: function(data) {
				if (root.no_account) {
					root.no_account = false;
					root.share_design = {id:data.id, public:"1"};
					root.show_share = true;
				} else {
					scope.edit_design(data.id);
				}
				scope.saving = false;
				scope.show_save_as = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not save design');
				scope.saving = false;
				scope.show_save_as = false;
				scope.$apply();
			}
		});
	};

	scope.save = function() {
		scope.saving = true;
		var design = {
			id: scope.design.id,
			variations: JSON.stringify(scope.variations)
		};
		scope.update_design(design, function() {
		});
	};

	scope.rename = function() {
		scope.saving = true;
		var design = {
			id: scope.design.id,
			name: scope.design.name
		};
		scope.update_design(design, function() {
			scope.show_rename = false;
		});
	};

	scope.update_design = function(design, callback) {
		$.ajax({
			type: 'POST',
			url: 'php/designs.php',
			data: design,
			dataType: 'json',
			success: function(data) {
				scope.saving = false;
				callback();
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.error('Could not save');
				scope.saving = false;
				callback();
				scope.$apply();
			}
		});
	};

	scope.set_primary = function(current) {
		$.each(scope.variations, function(i, variation) {
			if (variation.name === current.name) {
				variation.primary = true;
			} else {
				variation.primary = false;
			}
		});
	};

	scope.edit_design = function(id) {
		var params = {type:'saved', id:id};
 		state.go('edit', params);
	};

	scope.delete_design = function() {
		var design = scope.design;
		if (!scope.show_delete_design) {
			scope.show_delete_design = true;
			scope.deleting_design = design.id;
			return;
		}
		var data = {
			delete: true,
			id: scope.deleting_design
		};
		$.ajax({
			type: 'POST',
			url: 'php/designs.php',
			data: data,
			dataType: 'json',
			success: function(data) {
				scope.show_delete_design = false;
				scope.deleting_design = null;
				state.go('home');
				root.success('Your design has been deleted');
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.show_delete_design = false;
				scope.deleting_design = null;
				root.error('We could not delete your design. Try again later.');
				scope.$apply();
			}
		});
	};

	scope.show_share = function() {
		root.editing_share = true;
		//if already saved, show share window
		if (state.params.type === 'saved') {
			root.editing_share = false;
			root.share_design = scope.design;
			root.show_share = true;
		} else if (root.user.logged_in){
			// else if user is logged in, save then, share window.
			scope.show_save_as = true;
			return;
		} else {
			// else if user is not logged in, offer login screen + save window
			scope.show_login = true;
		}
	};
	scope.reset = function() {
		var reset_designs = JSON.parse(scope.product.variations);
		$.each(scope.variations, function(i, variation) {
			variation.svg = reset_designs[i].svg;
		});
		scope.show_reset = false;
	};


	//Close dropdown when clicking out of it
	$(document).click(function(e) {
		var elem = $(e.target);
		if (!elem.parents('.settings-button').length && !elem.hasClass('settings-button') && scope.show_settings) {
			scope.show_settings = false;
			scope.$apply();
		}
	});

	/* LISTENERS */
	scope.$watch('public', function(public) {
		if (state.params.type === 'saved' && !scope.loading) {
			scope.saving = true;
			scope.design.public = public ? 1 : 0;
			var design = {
				id: scope.design.id,
				public: scope.design.public
			};
			scope.update_design(design, function(){});
		}
	}, true);

	root.$on('share_set_public', function() {
		scope.public = true;
		scope.design.public = 1;
	});

}]);