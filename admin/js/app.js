var app = angular.module('kitePaintAdmin', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/")

	$stateProvider
		.state('designs', {
			url: '/designs',
			templateUrl: 'html/pages/designs.html',
			controller: 'DesignsController',
			data: {
				title: 'Designs'
			}
		})
		.state('home', {
			url: '/',
			templateUrl: 'html/pages/home.html',
			controller: 'HomeController',
			data: {
				title: 'Home'
			}
		})
		.state('products', {
			url: '/products',
			templateUrl: 'html/pages/products.html',
			controller: 'ProductsController',
			data: {
				title: 'Products'
			}
		})
		.state('manufacturers', {
			url: '/manufacturers',
			templateUrl: 'html/pages/manufacturers.html',
			controller: 'ManufacturersController',
			data: {
				title: 'Manufacturers'
			}
		})
		.state('retailers', {
			url: '/retailers',
			templateUrl: 'html/pages/retailers.html',
			controller: 'RetailersController',
			data: {
				title: 'Retailers'
			}
		})
		.state('users', {
			url: '/users',
			templateUrl: 'html/pages/users.html',
			controller: 'UsersController',
			data: {
				title: 'Users'
			}
		})
});