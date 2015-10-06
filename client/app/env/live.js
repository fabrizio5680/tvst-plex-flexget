'use strict';

/**
 * @ngdoc service
 * @name webappLoginApp.config
 * @description
 * # config
 * Service in the cbLogin.
 */
angular.module('clientApp')

  .provider('config', function config() {

    this.params = {};
    this.params.live = true;
    this.params.url = 'http://ver0n.ddns.net:34700';




    this.$get = function () {
      return this.params;
    };

  });

