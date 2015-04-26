app.controller('RetailerController', ['$scope', '$rootScope', function(scope, root) {
	root.done(1);

	//Variables
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
		content.subject += ' inquired about the becoming a KitePaint retailer.';
		content.comments += ' inquired about the becoming a KitePaint retailer.';
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