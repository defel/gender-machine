var app;

app = angular.module('gendernApp', ['ngResource'], function($routeProvider, $locationProvider) {

	$routeProvider
		.when(
			'/search/:word', {
				templateUrl: '/tmpl/results.html',
				controller: 'results'
			})
		.when(
			'/add', {
				templateUrl: '/tmpl/add.html',
				controller: 'add'
			}
		)
		.when(
			'/add/:word', {
				templateUrl: '/tmpl/addWord.html',
				controller: 'add'
			}
		)
		.when(
			'/', {
				templateUrl: '/tmpl/frontpage.html',
				controller: 'frontpage'
			}
		);

		$locationProvider.html5Mode(false);
});

app.controller('navbar', function($scope, $location) {
	console.log($location);

	$scope.addActive = function addActive() {
		return $location.path() === '/add';
	}

	$scope.searchActive = function searchActive() {
		return !$location.path() || $location.path() === '/';
	}
});

window.searchAsYouTypeWidget(app, {});
window.captureEventsDirective(app, {});