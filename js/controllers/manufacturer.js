app.controller('ManufacturerController', ['$scope', '$rootScope', function(scope, root) {
	root.done(1);

	//Variables
	scope.package = false;
	scope.inquired = false;

	//Functions
	scope.send = function() {
		var content = {
			email: scope.input_email,
			name: scope.input_name,
			to: 'spencer@kitepaint.com',
			subject: scope.input_name,
			comments: scope.input_name + ' (' + scope.input_email + ')'
		};
		if (scope.input_company) {
			content.subject += ' of ' + scope.input_company;
			scope.comments += ' of ' + scope.input_company;
		}
		if (scope.package){
			content.subject += ' inquired about the ' + scope.package + ' manufacturer package.';
			content.comments += ' inquired about the ' + scope.package + ' manufacturer package on KitePaint.com.';
		} else {
			content.subject += ' inquired about manufacturer packages.';
			content.comments += ' inquired about manufacturer packages on KitePaint.com.';
		}
		$.ajax({
			type: 'POST',
			url: 'php/email.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				if (data.sent) {
					scope.inquired = true;
					scope.$apply();
				} else {
					root.error(data.message);
					root.$apply();
				}
			},
			error: function(data) {
				var message = data.message || 'Unable to send message. Try again later';
				root.error(message);
				console.log('error');
			}
		});
	};
}]);