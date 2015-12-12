'use strict';

angular.module('henriPotier.store', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/store', {
		templateUrl: 'pages/store/store.html',
		controller: 'StoreCtrl'
	});
}])

.controller('StoreCtrl', ['$scope', 'Books', 'Storage', function($scope, Books, Storage) {
	
	$scope.books = [];

	// Récupération des livres
	Books.query(function(response) {
		$scope.books = response;
		$scope.initButtons();
	});

	$scope.reverse = false;
	
	// Tri du tableau
	$scope.reverseOrder = function(predicate) {
		$scope.reverse = !$scope.reverse;
	};


	$scope.isDisabled = {};

	// Initialisation des boutons d'ajout au panier, disabled si l'ISBN est déjà en sessionStorage
	$scope.initButtons = function() {
		var arraySize = $scope.books.length || 0;

		$scope.books.forEach(function(book) {
			if (Storage.isInStorage(book.isbn)) {
				$scope.isDisabled[book.isbn] = true;
			}
			else {
				$scope.isDisabled[book.isbn] = false;
			}
		});
	}

	// Ajout de l'ISBN en local Storage
	$scope.addToCart = function(book) {
		if (Storage.addBookToStorage(book)) {
			$scope.isDisabled[book.isbn] = true;
		}
	}
}]);