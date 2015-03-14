var app = angular.module('kitePaintRetailers', ['ui.router', 'uiRouterStyles']);

app.config(function($sceProvider) {
  $sceProvider.enabled(false);
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

	$locationProvider.hashPrefix('!');

	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/login");

	$stateProvider
		.state('activate', {
			url: '/activate?id&actcode',
			templateUrl: 'html/pages/activate.html',
			controller: 'ActivateController',
			data: {
				title: 'Activate',
				css: 'css/pages/activate.css'
			}
		})
		.state('account', {
			url: '/account',
			templateUrl: 'html/pages/account.html',
			controller: 'AccountController',
			data: {
				title: 'Account',
				css: 'css/pages/account.css'
			}
		})
		.state('embeds', {
			url: '/embeds',
			templateUrl: 'html/pages/embeds.html',
			controller: 'EmbedsController',
			data: {
				title: 'Embeds',
				css: 'css/pages/embeds.css'
			}
		})
		.state('orders', {
			url: '/orders',
			templateUrl: 'html/pages/orders.html',
			controller: 'OrdersController',
			data: {
				title: 'Orders',
				css: 'css/pages/orders.css'
			}
		})
		.state('login', {
			url: '/login',
			templateUrl: 'html/pages/login.html',
			controller: 'LoginController',
			data: {
				title: 'Login',
				css: 'css/pages/login.css'
			}
		});
});
if (parent !== window) {
	//don't allow embeds of site
	window.location.replace('error.php?m=embedding_prohibited');
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