app.controller('HomeController', ['$scope', '$rootScope', '$http', function(scope, root, http) {

	//LISTENERS
	root.$watch('invalid_login', function(invalid) {
		if (invalid) {
			root.invalid_login = false;
			root.sign_in.password = '';
			$('form.login').stop(true).animate({
				left: '5px'
			}, 100, function() {
				$('form.login').animate({
					left: '-5px'
				}, 200, function() {
					$('form.login').animate({
						left: '0'
					}, 100, function(){});
				});
			});
		}
	});
}]);