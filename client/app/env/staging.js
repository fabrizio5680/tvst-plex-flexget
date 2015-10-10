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
    this.params.live = false;
    this.params.url = '/';




    this.$get = function () {
      return this.params;
    };

  });

