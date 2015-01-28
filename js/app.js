var app = angular.module('kitePaint', ['ui.router', 'uiRouterStyles']);

app.config(function($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sceProvider.enabled(false);
});

app.config(function($stateProvider, $urlRouterProvider){

	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('about', {
			url: '/about',
			templateUrl: 'html/pages/about.html',
			controller: 'AboutController',
			data: {
				title: 'About',
				css: get_dependency('about')
			}
		})
		.state('activate', {
			url: '/activate',
			templateUrl: 'html/pages/activate.html',
			controller: 'ActivateController',
			data: {
				title: 'Activate',
				css: get_dependency('activate')
			}
		})
		.state('account', {
			url: '/account',
			templateUrl: 'html/pages/account.html',
			controller: 'AccountController',
			data: {
				title: 'Account',
				css: get_dependency('account')
			}
		})
		.state('changePassword', {
			url: '/changePassword',
			templateUrl: 'html/pages/changePassword.html',
			controller: 'ChangePasswordController',
			data: {
				title: 'Change Password',
				css: get_dependency('changePassword')
			}
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'html/pages/contact.html',
			controller: 'ContactController',
			data: {
				title: 'Contact',
				css: get_dependency('contact')
			}
		})
		.state('create', {
			url: '/create',
			templateUrl: 'html/pages/create.html',
			controller: 'CreateController',
			data: {
				title: 'Create',
				css: get_dependency('create')
			}
		})
		.state('designs', {
			url: '/designs',
			templateUrl: 'html/pages/designs.html',
			controller: 'DesignsController',
			data: {
				title: 'Designs',
				css: get_dependency('designs')
			}
		})
		.state('edit', {
			url: '/edit/:type?id',
			templateUrl: 'html/pages/edit.html',
			controller: 'EditController',
			data: {
				title: 'Edit',
				css: get_dependency('edit')
			}
		})
		.state('home', {
			url: '/',
			templateUrl: 'html/pages/home.html',
			controller: 'HomeController',
			data: {
				title: '',
				css: get_dependency('home')
			}
		})
		.state('manufacturer', {
			url: '/manufacturer',
			templateUrl: 'html/pages/manufacturer.html',
			controller: 'ManufacturerController',
			data: {
				title: 'Manufacturer',
				css: get_dependency('manufacturer')
			}
		})
		.state('retailer', {
			url: '/retailer',
			templateUrl: 'html/pages/retailer.html',
			controller: 'RetailerController',
			data: {
				title: 'Retailer',
				css: get_dependency('retailer')
			}
		})
		.state('view', {
			url: '/view?id',
			templateUrl: 'html/pages/view.html',
			controller: 'ViewController',
			data: {
				title: 'View',
				css: get_dependency('view')
			}
		});
});

function get_dependency(page) {
	var css = dependencies[environment].css.pages[page],
		responsive = !read_cookie('desktop'),
		dependency;
	if (!css) {
		return;
	}
	if (responsive) {
		dependency = ['css/' + css.main, 'css/' + css.responsive];
		if (!css.responsive.length) {
			dependency = 'css/' + css.main;
		}
	} else {
		dependency = 'css/' + css.main;
	}
	return dependency;
}

if (embed) {
	verify_embed();
} else {
	if (parent !== window) {
		//don't allow embeds of site
		window.location.replace('error.php?m=embedding_prohibited');
	}
}

function verify_embed() {
	if (parent === window) {
		//don't allow embed url unless in iframe
		window.location.replace('http://kitepaint.com');
	}
	var parent_url = document.referrer;
	var parent_domain = parent_url.split('://')[1]; //take of protocol
	parent_domain = parent_domain.split('/')[0]; //take off path
	if (parent_domain.split('.').length === 3) {
		parent_domain = parent_domain.split('.')[1] + '.' + parent_domain.split('.')[2]; //take of subdomain if exists
	}
	var path = window.location.href.split('#')[1];
	if ( path !== '/edit/new?id=' + product) {
		window.location.replace('error.php?m=bed_embed_url');
	}

	//Check domain
	var content = {
		filter: {
			id: product
		},
		return: [
			'embed'
		]
	};
	$.ajax({
		type: 'GET',
		url: 'php/products.php',
		data: content,
		dataType: 'json',
		success: function(data) {
			var urls = data[0].embed.split(',');

			if(urls.indexOf(parent_domain) < 0) {
				window.location.replace('error.php?m=bad_embed_domain');
			}
		},
		error: function(data) {
			window.location.replace('error.php?m=cannot_verify_embed_domain');
		}
	});
}

function create_cookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function read_cookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function erase_cookie(name) {
    create_cookie(name, "", -1);
}