'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ForeverCtrl
 * @description
 * # ForeverCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ForeverCtrl', function ($rootScope, config, $scope, $http, $routeParams) {
    var init = function () {
      $rootScope.page = 'Server Log';
      var lines = [];
      $http.get(config.url +'/logs/' + $routeParams.log).then(function (response) {

        angular.forEach(response.data.log, function (item) {
          item.line = item.line.replace(/[0-9]{2}-[0-9]{2}-[0-9]{4}[\s]/, '');
          lines.push(item);
        });

        $scope.foreverLogs = lines;
        $scope.foreverLogs.reverse();
      });
    };

    $scope.formatDate = function (x) {
      return moment(parseInt(x, 10), 'X').format('DD-MM-YYYY HH:mm');
    };



    init();
  });
