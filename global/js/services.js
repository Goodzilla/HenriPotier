'use strict';

angular.module('henriPotier.services', ['ngResource'])

.factory('Books', ['$resource', function($resource) {
	return $resource('http://henri-potier.xebia.fr/books/:isbn/:label', {}, {
		get: {method:'GET', params:{isbn: '@isbn', label: 'commercialOffers'}}
	});
}])

.factory('Storage', [function() {
	this.addToSessionStorage = function(key, value) {
		if (typeof(Storage) !== 'undefined') {
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			}
			sessionStorage.setItem(key, value);

			return true;
		} 
		else {
			return false;
		}
	}

	this.getFromSessionStorage = function(key, isObject) {
		if (typeof(Storage) !== 'undefined') {
			var value = sessionStorage.getItem(key);
			if (!!isObject) {
				value = JSON.parse(value);
			}

			return value;
		} 
		else {
			return false;
		}
	}

	this.addBookToStorage = function(book) {
		var currentCart = this.getFromSessionStorage('cart', true) || [];
		
		if (!this.isInStorage(book.isbn)) {
			currentCart.push(book.isbn);
		}

		return this.addToSessionStorage('cart', currentCart);
	}

	this.isInStorage = function(isbn) {
		var currentCart = this.getFromSessionStorage('cart', true) || [];
		var isInStorage = currentCart.indexOf(isbn);

		if (isInStorage < 0) {
			return false;
		}
		else {
			return true;
		}
	}

	return this;
}]);