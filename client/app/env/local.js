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
    this.params.url = 'http://localhost:34700';




    this.$get = function () {
      return this.params;
    };

  });

