app.controller('UsersController', ['$scope', '$rootScope', function(scope, root) {
	//Variables
	scope.users = [];//raw users data
	scope.display_users = []; //users data displayed
	scope.filtered_users = []; //filtered users
	scope.loading = false; //display loading text
	scope.query = ''; //search query
	scope.search = 'username'; //search parameter
	scope.num_display = 20; //number of users to display
	scope.sort = { //sorting setting
		metric: 'create_time',
		ascending: false
	};
	scope.show_edit = false;
	scope.editing = {};
	
	//Functions

	//retrieve users data
	scope.get_users = function() {
		scope.loading = true;
		var content = {
			return: [
				'loginid',
				'username',
				'create_time',
				'last_login',
				'email',
				'first_name',
				'last_name',
				'disabled',
				'activated',
				'admin',
				'deleted',
				'deleted_time'
			]
		};
		$.ajax({
			type: 'GET',
			data: content,
			url: 'php/users.php',
			dataType: 'json',
			success: function(data) {
				scope.users = data;
				scope.filtered_users = data;
				scope.loading = false;
				scope.sort_users();
				scope.$apply();
				console.log(scope.users);
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get users');
			}
		});
	};
	scope.get_users();

	//Filter users based on search using query
	scope.filter = function() {
		scope.filtered_users = [];
		$.each(scope.users, function(i, user) {
			if(user[scope.search].indexOf(scope.query) > -1) {
				scope.filtered_users.push(user);
			}
		});
		scope.sort_users();
	};

	//Put the first X num of users into the displayed table
	scope.update_users = function() {
		scope.display_users = [];
		for(var i = 0; i < scope.num_display && i < scope.filtered_users.length; i++) {
			scope.display_users.push(scope.filtered_users[i]);
		}
	};

	//sort array of users
	scope.sort_users = function() {
		scope.filtered_users.sort(function(a,b) {
			var metric = scope.sort.metric;
			var a_ = a[metric],
				b_ = b[metric];
			if (metric === 'create_time' || metric === 'last_login'){
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
		scope.update_users();
	};

	//set sorting parameters
	scope.sort_by = function(metric) {
		if(scope.sort.metric === metric) {
			scope.sort.ascending = !scope.sort.ascending;
		} else {
			scope.sort.metric = metric;
			if (metric === 'create_time' || metric === 'last_login') {
				scope.sort.ascending = false;
			} else {
				scope.sort.ascending = true;
			}
		}
		scope.sort_users();
	};

	//show more rows of users
	scope.show_more = function() {
		scope.num_display += 20;
		scope.sort_users();
	};

	//set editing user and show edit user lightbox
	scope.edit_user = function(user) {
		scope.editing = JSON.parse(JSON.stringify(user));
		scope.show_edit = true;
	};

	//show blank edit window
	scope.add_user = function() {
		scope.editing = {
			new: true
		};
		scope.show_edit = true;
	};

	//perform ajax post to save user data
	scope.save_user = function(user) {
		$.ajax({
			type: 'POST',
			url: 'php/users.php',
			data: user,
			dataType: 'json',
			success: function(data) {
				scope.get_users();
				scope.show_edit = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.get_users();
				alert('Could not save user');
			}
		});
	};

	//delete a user
	scope.delete_user = function(user) {
		var confirmed = confirm('Are you sure you want to delete ' + user.username + '?');
		if (confirmed) {
			$.ajax({
				type: 'POST',
				url: 'php/users.php',
				data: {loginid: user.loginid, delete: true},
				dataType: 'json',
				success: function(data) {
					scope.get_users();
					scope.show_edit = false;
					scope.$apply();
				},
				error: function(data) {
					console.log('error', data);
					scope.get_users();
					alert('Could not delete user');
				}
			});
		}
	};

	//trigger reset password
	scope.reset_password = function(user) {
		var confirmed = confirm('Are you sure you want to reset this password?');
		if (!confirmed) {
			return;
		}
		$.ajax({
			type: 'POST',
			url: 'php/users.php',
			data: {
				loginid: user.loginid, 
				reset: true,
				email: user.email,
				username: user.username
			},
			dataType: 'json',
			success: function(data) {
				scope.get_users();
				scope.show_edit = false;
				scope.$apply();
			},
			error: function(data) {
				console.log('error', data);
				scope.get_users();
				alert('Could not reset password');
			}
		});
	};
}]);