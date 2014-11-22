var app = angular.module('kitePaint', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/")

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
		.state('edit', {
			url: '/edit',
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
});