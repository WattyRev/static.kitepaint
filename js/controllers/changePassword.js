app.controller('ChangePasswordController', ['$scope', '$rootScope', function(scope, root) {

	//VARIABLES

	root.change_status = false;

	//FUNCTIONS
	
	root.done(1);

	root.change_password = function() {
		root.change.username = root.user.username;
		root.changing_password = true;
		$.ajax({
			type: 'POST',
			url: 'php/changepassword.php',
			data: root.change,
			dataType: 'json',
			success: function(data) {
				if (data.changed) {
					root.change_status = 'changed';
					root.success('Your password has been changed');
				} else {
					root.change_status = 'invalid';
					root.change_message = data.message;
					root.error(data.message);
				}
				root.changing_password = undefined;
				root.$apply();
			},
			error: function(data) {
				console.log('error', data);
				root.change_status = 'invalid';
				root.changing_password = undefined;
				root.change_message = data.message || 'Unable to change password. Try again later.';
				root.$apply();
				root.error(root.change_message);
			}
		});
	};
}]);