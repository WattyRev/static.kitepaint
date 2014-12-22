app.controller('HomeController', ['$scope', '$rootScope', '$http', function(scope, root, http) {
	//VARIABLES
	scope.designs = [];

	//FUNCTIONS
	scope.get_designs = function() {
		var content = {
			filter: {
				active: 1,
				public: 1
			},
			return: [
				'id',
				'created',
				'name',
				'variations',
			],
			limit: 6,
			order: ['id', 'DESC']
		};
		$.ajax({
			type: 'GET',
			url: 'php/designs.php',
			data: content,
			dataType: 'json',
			success: function(data) {
				scope.designs = data;
				$.each(scope.designs, function(i, design) {
					design.variations = JSON.parse(design.variations);
					design.created = new Date(design.created);
					$.each(design.variations, function(i, variation) {
						if (variation.primary) {
							design.primary = variation;
							return false;
						}
					});
				});
				scope.$apply();
				console.log(scope.designs);
			},
			error: function(data) {
				console.log('error', data);
				alert('Could not get designs');
			}
		});
	};
	scope.get_designs();

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