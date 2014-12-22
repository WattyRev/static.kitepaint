app.controller('ContactController', ['$scope', '$rootScope', function(scope, root) {
	//FUNCTIONS
	scope.send = function() {
		var content = {
			email: scope.email,
			name: scope.name,
			subject: scope.subject,
			comments: scope.comments,
			to: 'spencer@wattydev.com'
		};
		$.ajax({
			type: 'POST',
			url: 'php/email.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				if (data.sent) {
					root.success('Your message has been sent');
					scope.comments = '';
					scope.$apply();
					console.log('success');
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