'use strict';

// Declare app level module which depends on views, and components
angular.module('henriPotier', [
	'ngRoute',
	'ngResource',
	'henriPotier.services',
	'henriPotier.store',
	'henriPotier.cart'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/store'});
}]);