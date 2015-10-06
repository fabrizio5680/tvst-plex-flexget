'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ShowsCtrl
 * @description
 * # ShowsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ShowsCtrl', function ($rootScope, $scope, $timeout, config, $http, $mdToast, $location, $mdDialog) {

    var init = function () {
      $rootScope.page = 'Series';
      var search = $location.search();
      $scope.filterApproved = search.approved === undefined ? true : search.approved;
      $scope.showFilter = {};

      $http.get(config.url + '/getShows').then(function (response) {
        var shows = response.data.shows;

        angular.forEach(shows, function (show) {
          if (show.begin) {
            show.cEpisode = show.begin.match(/e(\d{2})/i)[1];
            show.cSeason = show.begin.match(/s(\d{2})/i)[1];
            show.isApproved = show.approved;
          }

          if (show.banner) {
            if (show.banner.indexOf('thetvdb.com') === -1 && show.banner.indexOf('/images/') === -1) {
              show.banner = 'http://thetvdb.com/banners/' + show.banner
            }
          } else {
            show.banner = '/images/banner_template.png';
          }
        });

        shows.sort(function(a, b){
          if(a.title < b.title) return -1;
          if(a.title > b.title) return 1;
          return 0;
        });
        $scope.shows = shows;

        $timeout(function () {
          $rootScope.ready = true;
        }, 100);

      });
    };

    $scope.editImage = function (ev, show) {
      $mdDialog.show({
        controller: function ($scope, $mdDialog) {
          $scope.banner = show.banner;
          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.answer = function() {
            $mdDialog.hide($scope.banner);
          };
        },
        templateUrl: '/views/edit_image_dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      }).then(function(banner) {
        show.banner = banner;
      }, function() {

      });
    };


    $scope.saveShow = function (show) {
      $scope.saving = show.id;

      $http.post(config.url + '/show/save', {
        show: {
          id: show.id,
          begin: 'S' + show.cSeason + 'E' + show.cEpisode,
          approved: show.isApproved,
          quality: show.quality,
          target: show.target,
          timeframe: show.timeframe,
          banner: show.banner
        }
      }).then(function (response) {
        if (response.data.success) {
          $timeout(function () {
            $scope.saving = null;
            show.approved = response.data.show.approved;
            showSimpleToast(show);
          }, 1000)
        }

      });

    };

    $scope.deleteShow = function (show) {
      $scope.saving = show.id;

      $http.post(config.url + '/show/delete', {
        show: {
          _id: show._id
        }
      }).then(function (response) {
        if (response.data.success) {
          $timeout(function () {
            $scope.saving = null;
            showSimpleToast(show);
            show = null;
          }, 1000)
        }

      });

    };

    var toastPosition = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };
    var getToastPosition = function() {
      return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
    };

    var showSimpleToast = function(show) {
      $mdToast.show(
        $mdToast.simple()
          .content(show.title + ' - Save success!')
          .position(getToastPosition())
          .hideDelay(3000)
      );
    };

    $scope.showSample = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Supported Parameters')
          .content('<img style="width:100%;max-width: 310px" src="/images/samplequality.png">')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
    };

    //$scope.showActionToast = function() {
    //  var toast = $mdToast.simple()
    //    .content('Action Toast!')
    //    .action('OK')
    //    .highlightAction(false)
    //    .position($scope.getToastPosition());
    //  $mdToast.show(toast).then(function(response) {
    //    if ( response == 'ok' ) {
    //      alert('You clicked \'OK\'.');
    //    }
    //  });
    //};

    init();
  });
