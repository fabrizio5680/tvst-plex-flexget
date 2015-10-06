'use strict';

describe('Service: config', function () {

  // instantiate service
  var config,
    init = function () {
      inject(function (_config_) {
        config = _config_;
      });
    };

  // load the service's module
  beforeEach(module('clientApp'));

  it('should do something', function () {
    init();

    expect(!!config).toBe(true);
  });

  it('should be configurable', function () {
    module(function (configProvider) {
      configProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(config.greet()).toEqual('Lorem ipsum');
  });

});
