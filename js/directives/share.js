app.directive('share', function() {
	function link(scope, element, attrs) {
		//VARIABLES
			scope.url = root.base_url + '/#/view?id=' + root.share_design;
			scope.selected = 'link';

		//FUNCTIONS
			//close lightbox
			$(document).click(function(e) {
				var clicked = $(e.target);
				if (!clicked.parents('.lightbox').length && !clicked.hasClass('lightbox') && !clicked.hasClass('icon')) {
					root.show_share = false;
					root.$apply();
				}
			});

		//LISTENERS
			root.$watch('share_design', function(id) {
				scope.url = root.base_url + '/#/view?id=' + id;
				scope.facebok_url = 'https://www.facebook.com/sharer/sharer.php?app_id=113869198637480&u=' + scope.url;
			});
	}
	return {
		restrict: 'E',
		templateUrl: 'html/directives/share.html',
		link: link
	};
});