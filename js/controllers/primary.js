app.controller('PrimaryController', ['$scope', '$rootScope', '$state', function(scope, root, state) {

	//VARIABLES
	scope.current_page = '';
	root.base_url = 'http://www.wattydev.com/projects/kite_paint';
	root.has_account = localStorage.kp_has_account ? localStorage.kp_has_account === 'true' : false;
	root.sign_in = {
		username: '',
		password: '',
	};
	root.reset = {
		username: '',
		email: ''
	};
	root.register = {
		username: '',
		email: '',
		password: '',
		password2: ''
	};
	root.change = {
		oldpassword: '',
		password: '',
		password2: '',
		username: ''
	};
	root.invalid_login = false;
	root.user = localStorage.user ? JSON.parse(localStorage.user) : false;
	root.register_status = false;
	root.reset_status = false;
	root.lost_password = false;
	root.alert_content = {};

	//FUNCTIONS
	root.login = function() {
		root.login_loading = true;
		$.ajax({
			type: 'POST',
			url: 'php/index.php',
			data: root.sign_in,
			dataType: 'json',
			success: function(data) {
				console.log('success', data);
				if (!data.logged_in) {
					root.invalid_login = true;
					console.log(data);
					//invalid login
					root.error(data.message);
				} else {
					root.user = data;
					root.invalid_login = false;
					root.login_message = data.message;
				}
				root.login_loading = undefined;
				root.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.login_loading = undefined;
				root.login_message = data.message || 'Unable to log in. Try again later.';
				root.$apply();
				root.error(root.login_message);
			}
		});
	};
	root.logout = function() {
		root.logging_out = true;
		$.ajax({
			type: 'POST',
			url: 'php/logout.php',
			data: root.sign_in,
			success: function(data) {
				root.user = false;
				root.logging_out = undefined;
				root.$apply();
				root.success('You have signed out');
			},
			error: function(data) {
				console.log('error', data);
				root.logging_out = undefined;
				root.$apply();
				root.error('Unable to sign out');
			}
		});
	};
	root.register = function() {
		root.registering = true;
		$.ajax({
			type: 'POST',
			url: 'php/register.php',
			data: root.register,
			dataType: 'json',
			success: function(data) {
				console.log('success', data);
				if (data.registered) {
					root.register_status = 'registered';
					root.success('You have created an account');
				} else {
					root.register_status = 'invalid';
					root.register_message = data.message;
					root.error(data.message);
				}
				root.registering = undefined;
				root.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.register_status = 'invalid';
				root.registering = undefined;
				root.register_message = data.message || 'Unable to register. Try again later.';
				root.$apply();
				root.error(root.register_message);
			}
		});
	};
	root.reset_password = function() {
		root.resetting = true;
		$.ajax({
			type: 'POST',
			url: 'php/lostpassword.php',
			data: root.reset,
			dataType: 'json',
			success: function(data) {
				console.log('success', data);
				if (data.reset) {
					root.reset_status = 'reset';
					root.lost_password = false;
					root.success('You have reset your password');
				} else {
					root.reset_status = 'invalid';
					root.reset_message = data.message;
					root.error(data.message);
				}
				root.resetting = undefined;
				root.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.reset_status = 'invalid';
				root.resetting = undefined;
				root.reset_message = data.message || 'Unable to reset password. Try again later.';
				root.$apply();
				root.error(root.reset_message);
			}
		});
	};
	root.check_login = function() {
		if (!localStorage.user || localStorage.user === 'false' || localStorage.user === 'null') {
			return;
		}
		var user_data = JSON.parse(localStorage.user);
		user_data.update_login = true;
		root.login_loading = true;
		$.ajax({
			type: 'POST',
			url: 'php/index.php',
			data: user_data,
			dataType: 'json',
			success: function(data) {
				if (!data.logged_in){
					root.user = false;
					if (scope.current_page === 'account') {
						state.go('home');
					}
				} else {
					root.user = data;
				}
				root.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.user = false;
				if (scope.current_page === 'account') {
					state.go('home');
				}
			}
		});
	};
	root.check_login();

	root.request_desktop_version = function() {
		console.log('test');
		create_cookie('desktop', true, 30);
		location.reload();
	};

	root.return_mobile_version = function() {
		erase_cookie('desktop');
		location.reload();
	};

	root.alert = function(type, message, confirm) {
		root.alert_content = {
			type: type,
			message: message,
			confirm: confirm ? true : false
		};
		root.$apply();
	};
	root.error = function(message, confirm) {
		root.alert('error', message, confirm);
	};
	root.success = function(message, confirm) {
		root.alert('success', message, confirm);
	};

	//LISTENERS
	//Update current page data
	root.$on('$stateChangeStart', function(event, toState) {
		scope.current_page = toState;
		//reset variables
		root.invalid_login = false;
		root.register_status = false;
		root.reset_status = false;
		root.lost_password = false;
		root.change_status = false;
	});

	//update has_account local storage variable
	root.$watch('has_account', function(has_account) {
		localStorage.kp_has_account = has_account;
	});

	root.$watch('user', function(user) {
		localStorage.user = JSON.stringify(user);
	}, true);

	window.root = root;
}]);