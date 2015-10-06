'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($rootScope, $scope, config, $timeout, $http) {
    var init = function () {
      $rootScope.page = 'Plex';

      $scope.shows = [];

      $http.get(config.url + '/checkin').then(function (response) {
        var shows = response.data.episodes || [];
        if (!config.live) {
          shows = [{"_id":"55e308dccc1161943494f077","lastViewedAt":"1440942283","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"2","show_id":"289541","season_number":"1","number":"8","__v":0},{"_id":"55e3402ccc1161943494f078","lastViewedAt":"1440956437","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"1","show_id":"289541","season_number":"1","number":"25","__v":0},{"_id":"55e3420ccc1161943494f079","lastViewedAt":"1440956895","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"1","__v":0},{"_id":"55e364f8cc1161943494f07a","lastViewedAt":"1440965858","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"20","__v":0},{"_id":"55e36ed0cc1161943494f07b","lastViewedAt":"1440968399","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"21","__v":0},{"_id":"55e3e928869f262c0eca823b","lastViewedAt":"1440999694","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"2","__v":0},{"_id":"55e3eacc869f262c0eca823c","lastViewedAt":"1441000122","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"3","__v":0},{"_id":"55e498f0869f262c0eca823d","lastViewedAt":"1441044700","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"4","__v":0},{"_id":"55e4b0d8869f262c0eca823e","lastViewedAt":"1441050803","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"22","__v":0},{"_id":"55e4c0c8869f262c0eca823f","lastViewedAt":"1441054896","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"23","__v":0},{"_id":"55e5e1c49ba3da241c53ea09","lastViewedAt":"1441128898","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"4","show_id":"289541","season_number":"1","number":"8","__v":0},{"_id":"55e5e3a49ba3da241c53ea0a","lastViewedAt":"1441129360","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"2","show_id":"289541","season_number":"1","number":"9","__v":0},{"_id":"55e5e5489ba3da241c53ea0b","lastViewedAt":"1441129785","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"2","show_id":"289541","season_number":"1","number":"10","__v":0},{"_id":"55e7359d1b6d4a9427a0033b","lastViewedAt":"1441215859","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"5","__v":0},{"_id":"55e737411b6d4a9427a0033c","lastViewedAt":"1441216282","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"6","__v":0},{"_id":"55e7de991b6d4a9427a0033d","lastViewedAt":"1441259107","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"7","__v":0},{"_id":"55e7e03c1b6d4a9427a0033e","lastViewedAt":"1441259526","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"5","show_id":"289541","season_number":"1","number":"8","__v":0},{"_id":"55e7e1e11b6d4a9427a0033f","lastViewedAt":"1441259969","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"9","__v":0},{"_id":"55e7e3851b6d4a9427a00340","lastViewedAt":"1441260401","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"10","__v":0},{"_id":"55e889b01b6d4a9427a00341","lastViewedAt":"1441302924","parent":"Peppa Pig","art":"/library/metadata/3588/art/1436710020","views":"2","show_id":"79222","season_number":"2","number":"8","__v":0},{"_id":"55e88adc1b6d4a9427a00342","lastViewedAt":"1441303235","parent":"Peppa Pig","art":"/library/metadata/3588/art/1436710020","views":"1","show_id":"79222","season_number":"2","number":"45","__v":0}];
        }

        angular.forEach(shows, function (show) {
          loadImage(show, 'http://ver0n.ddns.net:32400' + show.art + '?X-Plex-Token=QMHARuxedVkLMsEySe8g');

          $scope.shows.push(show);

        });

        $scope.shows.reverse();
      });
    };


    var loadImage = function (show, url) {
      var img = new Image();

      show.art = url;

      img.onerror = function () {
        $timeout(function () {
          show.art = '/images/placeholder.jpg';
        });
      };
      img.src = url;
    };

    $scope.formatDate = function (x) {
      return moment(parseInt(x, 10), 'X').format('DD MMM, HH:mm:ss')
    };



    init();
  });
