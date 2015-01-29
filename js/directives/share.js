app.directive('share', function() {
	function link(scope, element, attrs) {
		//VARIABLES
			scope.url = root.base_url;
			scope.encoded_url = root.base_url;
			scope.selected = 'link';

		//FUNCTIONS
			
			scope.share_facebook = function() {
				FB.ui(
					{
						method: 'feed',
						name: root.share_design.name + ' Design on KitePaint',
						link: scope.url,
						picture: root.base_url + '/img/blank_dual_line-01.png',
						caption: 'Kite Design',
						description: 'A kite design made on KitePaint.com!'
					},
					function(response) {
						var published = true;
						if (response && response.post_id) {
						} else {
							published = false;
						}
						if (published) {
							root.show_share = false;
							root.$apply();
						}
					}
				);
			};
		
			//close lightbox
			$(document).click(function(e) {
				var clicked = $(e.target);
				if (!clicked.parents('.lightbox').length && !clicked.hasClass('lightbox') && (!clicked.hasClass('icon') && !clicked.hasClass('share'))) {
					root.show_share = false;
					root.$apply();
				}
			});

		//LISTENERS
			root.$watch('share_design', function(design) {
				if (!design) {
					return;
				}
				scope.url = root.base_url + '/#/view?id=' + design.id;
				scope.encoded_url = root.base_url + encodeURIComponent('/#/view?id=' + design.id);
			});
	}
	return {
		restrict: 'E',
		templateUrl: 'html/directives/share.html',
		link: link
	};
});