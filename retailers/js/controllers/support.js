app.controller('SupportController', ['$scope', '$rootScope', '$state', function(scope, root, state) {

	//functions
	scope.send = function() {
		console.log('test');
		var data = {
			email: root.retailer.email,
			name: root.retailer.name,
			subject: 'Support Question from ' + root.retailer.name,
			comments: scope.message,
			to: 'spencer@kitepaint.com'
		};
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: '../php/email.php',
			data: data,
			success: function(data) {
				if(!data.sent) {
					root.error(data.message || 'Unable to send your message. Try again later.');
					console.log('error', data);
					root.$apply();
					return;
				}
				root.success('Your message has been sent to KitePaint administration.');
				scope.message = '';
				root.$apply();
			},
			error: function(data) {
				root.error('Unable to send your message. Try again later.');
				console.log('error', data);
				root.$apply();
			}
		});
	};
}]);