'use strict';

describe('Filter: approved', function () {

  // load the filter's module
  beforeEach(module('clientApp'));

  // initialize a new instance of the filter before each test
  var approved;
  beforeEach(inject(function ($filter) {
    approved = $filter('approved');
  }));

  it('should return the input prefixed with "approved filter:"', function () {
    var text = 'angularjs';
    expect(approved(text)).toBe('approved filter: ' + text);
  });

});
