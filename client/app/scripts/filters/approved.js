'use strict';

/**
 * @ngdoc filter
 * @name clientApp.filter:approved
 * @function
 * @description
 * # approved
 * Filter in the clientApp.
 */
angular.module('clientApp')
  .filter('approved', function() {
    return function(input, search) {
      if (!input) return input;
      if (!search) return input;
      var expected = ('' + search).toLowerCase();
      var result = [];
      angular.forEach(input, function(value, key) {
        var actual = ('' + value).toLowerCase();
        if (actual.indexOf(expected) !== -1) {
          result[key] = value;
        }
      });
      return result;
    }
  });
