'use strict';

angular.module('henriPotier.cart', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/cart', {
		templateUrl: 'pages/cart/cart.html',
		controller: 'CartCtrl'
	});
}])

.controller('CartCtrl', ['$scope', 'Books', 'Storage', function($scope, Books, Storage) {

	// Récupération des ISBN en session Storage
	$scope.currentCart = Storage.getFromSessionStorage('cart', true) || [];

	$scope.books = [];
	$scope.cartBooks = [];
	$scope.offers = [];
	$scope.selectedOffer = {};

	// Récupération de tous les livres
	Books.query(function(response) {
		$scope.books = response;
		$scope.getCartBooks();
	});


	$scope.getCommercialOffers = function() {
		// Récupération des offres commerciales
		if ($scope.currentCart.length > 0) {
			Books.get({isbn: $scope.currentCart.join()}, function(response) {
				$scope.offers = response.offers;
			});
		}
	}

	// Récupération des livres dans le panier
	$scope.getCartBooks = function() {
		$scope.books.forEach(function(book) {
			if (Storage.isInStorage(book.isbn)) {
				book.qty = 1;
				book.total = book.price * book.qty;
				$scope.cartBooks.push(book);
			}
		});
	};

	// Suppression d'un livre dans le panier
	$scope.removeFromCart = function(book) {
		// Suppression du livre en local
		var newArray = $scope.cartBooks
			.filter(function (cartBook) {
				return cartBook.isbn !== book.isbn;
			});

		$scope.cartBooks = newArray;

		// Suppression du livre du session Storage
		var index = $scope.currentCart.indexOf(book.isbn);
		if (index > -1) {
			$scope.currentCart.splice(index, 1);
		}

		Storage.addToSessionStorage('cart', $scope.currentCart);

		// Mise à jour des offres commerciales
		$scope.getCommercialOffers();
	}

	// Prix total pour un livre (qté * prix)
	$scope.totalForOneBook = function(book) {
		var total = book.qty * book.price;

		return total;
	}

	// Prix total pour tous les livres
	$scope.totalPrice = function(withOffer) {
		var total = 0;
		var bestPrice = 0;
		var offerPrice = 0;

		$scope.cartBooks.forEach(function(book) {
			total += book.qty * book.price;
		})

		bestPrice = total;

		if (!!withOffer) {
			$scope.offers.forEach(function(offer) {
				switch (offer.type) {
					case 'percentage':
							offerPrice = total * ((100 - offer.value)/100);
							if (offerPrice < bestPrice) {
								bestPrice = offerPrice;
								$scope.selectedOffer = 'Remise de ' + offer.value + '%';
							}
						break;
					case 'minus':
							offerPrice = total - offer.value;
							if (offerPrice < bestPrice) {
								bestPrice = offerPrice;
								$scope.selectedOffer = 'Remise de ' + offer.value + '€';
							}
						break;
					case 'slice':
							offerPrice = total - ~~(total / offer.sliceValue) * offer.value;
							if (offerPrice < bestPrice) {
								bestPrice = offerPrice;
								$scope.selectedOffer = 'Remise de ' + offer.value + '€ par tranches de ' + offer.sliceValue + '€';
							}
						break;
					default:
							bestPrice = total;
						break;
				}
			});
		}

		return bestPrice;
	}

	$scope.getCommercialOffers();
}]);