'use strict';

describe('Controller: ForeverCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ForeverCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForeverCtrl = $controller('ForeverCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ForeverCtrl.awesomeThings.length).toBe(3);
  });
});
