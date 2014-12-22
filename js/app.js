var app = angular.module('kitePaint', ['ui.router']);

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
				title: 'About'
			}
		})
		.state('activate', {
			url: '/activate',
			templateUrl: 'html/pages/activate.html',
			controller: 'ActivateController',
			data: {
				title: 'Activate'
			}
		})
		.state('account', {
			url: '/account',
			templateUrl: 'html/pages/account.html',
			controller: 'AccountController',
			data: {
				title: 'Account'
			}
		})
		.state('changePassword', {
			url: '/changePassword',
			templateUrl: 'html/pages/changePassword.html',
			controller: 'ChangePasswordController',
			data: {
				title: 'Change Password'
			}
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'html/pages/contact.html',
			controller: 'ContactController',
			data: {
				title: 'Contact'
			}
		})
		.state('create', {
			url: '/create',
			templateUrl: 'html/pages/create.html',
			controller: 'CreateController',
			data: {
				title: 'Create'
			}
		})
		.state('designs', {
			url: '/designs',
			templateUrl: 'html/pages/designs.html',
			controller: 'DesignsController',
			data: {
				title: 'Designs'
			}
		})
		.state('edit', {
			url: '/edit/:type?id',
			templateUrl: 'html/pages/edit.html',
			controller: 'EditController',
			data: {
				title: 'Edit'
			}
		})
		.state('home', {
			url: '/',
			templateUrl: 'html/pages/home.html',
			controller: 'HomeController',
			data: {
				title: ''
			}
		})
		.state('view', {
			url: '/view?id',
			templateUrl: 'html/pages/view.html',
			controller: 'ViewController',
			data: {
				title: 'View'
			}
		});
});

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