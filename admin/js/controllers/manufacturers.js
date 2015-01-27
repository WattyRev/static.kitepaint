app.controller('ManufacturersController', ['$scope', '$rootScope', '$state', function(scope, root, state) {
	//Variables
	scope.manufacturers = [];//raw manufacturers data
	scope.display_manufacturers = []; //manufacturers data displayed
	scope.filtered_manufacturers = []; //filtered manufacturers
	scope.loading = false; //display loading text
	scope.query = ''; //search query
	scope.search = 'name'; //search parameter
	scope.num_display = 20; //number of manufacturers to display
	scope.sort = { //sorting setting
		metric: 'created',
		ascending: false
	};
	scope.show_edit = false;
	scope.editing = {};
	
	//Functions

	//retrieve manufacturers data
	scope.get_manufacturers = function() {
		scope.loading = true;
		$.ajax({
			type: 'GET',
			url: 'php/manufacturers.php?get=1',
			dataType: 'json',
			success: function(data) {
				scope.manufacturers = data;
				scope.filtered_manufacturers = data;
				scope.loading = false;
				scope.sort_manufacturers();
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get manufacturers');
			}
		});
	};
	scope.get_manufacturers();

	//Filter manufacturers based on search using query
	scope.filter = function() {
		scope.filtered_manufacturers = [];
		$.each(scope.manufacturer, function(i, manufacturer) {
			if(manufacturer[scope.search].indexOf(scope.query) > -1) {
				scope.filtered_manufacturers.push(manufacturer);
			}
		});
		scope.sort_manufacturers();
	};

	//Put the first X num of manufacturers into the displayed table
	scope.update_manufacturers = function() {
		scope.display_manufacturers = [];
		for(var i = 0; i < scope.num_display && i < scope.filtered_manufacturers.length; i++) {
			scope.display_manufacturers.push(scope.filtered_manufacturers[i]);
		}
	};

	//sort array of manufacturers
	scope.sort_manufacturers = function() {
		scope.filtered_manufacturers.sort(function(a,b) {
			var metric = scope.sort.metric;
			var a_ = a[metric],
				b_ = b[metric];
			if (metric === 'created' || metric === 'last_paid'){
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
		scope.update_manufacturers();
	};

	//set sorting parameters
	scope.sort_by = function(metric) {
		if(scope.sort.metric === metric) {
			scope.sort.ascending = !scope.sort.ascending;
		} else {
			scope.sort.metric = metric;
			if (metric === 'created' || metric === 'last_paid') {
				scope.sort.ascending = false;
			} else {
				scope.sort.ascending = true;
			}
		}
		scope.sort_manufacturers();
	};

	//show more rows of manufacturers
	scope.show_more = function() {
		scope.num_display += 20;
		scope.sort_manufacturers();
	};

	//set editing manufacturer and show edit manufacturer lightbox
	scope.edit_manufacturer = function(manufacturer) {
		scope.editing = JSON.parse(JSON.stringify(manufacturer));
		scope.show_edit = true;
	};

	//show blank edit window
	scope.add_manufacturer = function() {
		scope.editing = {
			new: true
		};
		scope.show_edit = true;
	};

	//perform ajax post to save manufacturer data
	scope.save_manufacturer = function(manufacturer) {
		$.ajax({
			type: 'POST',
			url: 'php/manufacturers.php',
			data: manufacturer,
			dataType: 'json',
			success: function(data) {
				scope.get_manufacturers();
				scope.show_edit = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.get_manufacturers();
				alert('Could not save manufacturer');
			}
		});
	};

	//delete a manufacturer
	scope.delete_manufacturer = function(manufacturer) {
		var confirmed = confirm('Are you sure you want to delete ' + manufacturer.name + '?');
		if (confirmed) {
			$.ajax({
				type: 'POST',
				url: 'php/manufacturers.php',
				data: {id: manufacturer.id, delete: true},
				dataType: 'json',
				success: function(data) {
					console.log('success', data);
					scope.get_manufacturers();
					scope.show_edit = false;
					scope.$apply();
				},
				error: function(data) {
					console.log('error', data);
					scope.get_manufacturers();
					alert('Could not delete manufacturer');
				}
			});
		}
	};

	//trigger reset password
	scope.update_paid = function(manufacturer) {
		var confirmed = confirm('Are you sure you want to reset this password?');
		if (!confirmed) {
			return;
		}
		$.ajax({
			type: 'POST',
			url: 'php/manufacturers.php',
			data: {
				id: manufacturer.id, 
				paid: true
			},
			dataType: 'json',
			success: function(data) {
				console.log('success', data);
				scope.get_manufacturers();
				scope.show_edit = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.get_manufacturers();
				alert('Could not reset password');
			}
		});
	};
}]);