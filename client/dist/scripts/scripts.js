'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'angular-toArrayFilter'
  ])
  .config(["$routeProvider", "$mdThemingProvider", "$mdIconProvider", function ($routeProvider, $mdThemingProvider, $mdIconProvider) {
    $mdIconProvider
      .defaultIconSet("../images/svg/avatars.svg", 128)
      .icon("share"      , "../images/svg/share.svg"       , 24)
      .icon("google_plus", "../images/svg/google_plus.svg" , 512)
      .icon("hangouts"   , "../images/svg/hangouts.svg"    , 512)
      .icon("twitter"    , "../images/svg/twitter.svg"     , 512)
      .icon("phone"      , "../images/svg/phone.svg"       , 512);

    // Update the theme colors to use themes on font-icons
    $mdThemingProvider.theme('default')
      .primaryPalette("blue-grey")
      .accentPalette('pink')
      .warnPalette('red');


    $routeProvider
      .when('/', {
        templateUrl: 'views/shows.html',
        controller: 'ShowsCtrl',
        controllerAs: 'shows'
      })
      .when('/checkin', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/logs/:log', {
        templateUrl: 'views/forever.html',
        controller: 'ForeverCtrl',
        controllerAs: 'forever'
      })
      .when('/shows', {
        templateUrl: 'views/shows.html',
        controller: 'ShowsCtrl',
        controllerAs: 'shows'
      })
      .when('/all-shows', {
        templateUrl: 'views/all_shows.html',
        controller: 'ShowsCtrl',
        controllerAs: 'shows'
      })
      .otherwise({
        redirectTo: '/shows'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', ["$rootScope", "$scope", "config", "$timeout", "$http", function ($rootScope, $scope, config, $timeout, $http) {
    var init = function () {
      $rootScope.page = 'Plex';

      $scope.shows = [];

      $http.get(config.url + '/checkin').then(function (response) {
        var shows = response.data.episodes || [];
        if (!config.live) {
          shows = [{"_id":"55e308dccc1161943494f077","lastViewedAt":"1440942283","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"2","show_id":"289541","season_number":"1","number":"8","__v":0},{"_id":"55e3402ccc1161943494f078","lastViewedAt":"1440956437","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"1","show_id":"289541","season_number":"1","number":"25","__v":0},{"_id":"55e3420ccc1161943494f079","lastViewedAt":"1440956895","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"1","__v":0},{"_id":"55e364f8cc1161943494f07a","lastViewedAt":"1440965858","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"20","__v":0},{"_id":"55e36ed0cc1161943494f07b","lastViewedAt":"1440968399","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"21","__v":0},{"_id":"55e3e928869f262c0eca823b","lastViewedAt":"1440999694","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"2","__v":0},{"_id":"55e3eacc869f262c0eca823c","lastViewedAt":"1441000122","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"3","__v":0},{"_id":"55e498f0869f262c0eca823d","lastViewedAt":"1441044700","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"4","__v":0},{"_id":"55e4b0d8869f262c0eca823e","lastViewedAt":"1441050803","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"22","__v":0},{"_id":"55e4c0c8869f262c0eca823f","lastViewedAt":"1441054896","parent":"Criminal Minds","art":"/library/metadata/689/art/1435591366","views":"1","show_id":"75710","season_number":"10","number":"23","__v":0},{"_id":"55e5e1c49ba3da241c53ea09","lastViewedAt":"1441128898","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"4","show_id":"289541","season_number":"1","number":"8","__v":0},{"_id":"55e5e3a49ba3da241c53ea0a","lastViewedAt":"1441129360","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"2","show_id":"289541","season_number":"1","number":"9","__v":0},{"_id":"55e5e5489ba3da241c53ea0b","lastViewedAt":"1441129785","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"2","show_id":"289541","season_number":"1","number":"10","__v":0},{"_id":"55e7359d1b6d4a9427a0033b","lastViewedAt":"1441215859","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"5","__v":0},{"_id":"55e737411b6d4a9427a0033c","lastViewedAt":"1441216282","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"6","__v":0},{"_id":"55e7de991b6d4a9427a0033d","lastViewedAt":"1441259107","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"7","__v":0},{"_id":"55e7e03c1b6d4a9427a0033e","lastViewedAt":"1441259526","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"5","show_id":"289541","season_number":"1","number":"8","__v":0},{"_id":"55e7e1e11b6d4a9427a0033f","lastViewedAt":"1441259969","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"9","__v":0},{"_id":"55e7e3851b6d4a9427a00340","lastViewedAt":"1441260401","parent":"Hey Duggee","art":"/library/metadata/4974/art/1440706174","views":"3","show_id":"289541","season_number":"1","number":"10","__v":0},{"_id":"55e889b01b6d4a9427a00341","lastViewedAt":"1441302924","parent":"Peppa Pig","art":"/library/metadata/3588/art/1436710020","views":"2","show_id":"79222","season_number":"2","number":"8","__v":0},{"_id":"55e88adc1b6d4a9427a00342","lastViewedAt":"1441303235","parent":"Peppa Pig","art":"/library/metadata/3588/art/1436710020","views":"1","show_id":"79222","season_number":"2","number":"45","__v":0}];
        }

        angular.forEach(shows, function (show) {
          loadImage(show, config.url + show.art + '?X-Plex-Token=QMHARuxedVkLMsEySe8g');

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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ForeverCtrl
 * @description
 * # ForeverCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ForeverCtrl', ["$rootScope", "config", "$scope", "$http", "$routeParams", function ($rootScope, config, $scope, $http, $routeParams) {
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
  }]);

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ShowsCtrl
 * @description
 * # ShowsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ShowsCtrl', ["$rootScope", "$scope", "$timeout", "config", "$http", "$mdToast", "$location", "$mdDialog", function ($rootScope, $scope, $timeout, config, $http, $mdToast, $location, $mdDialog) {

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
        controller: ["$scope", "$mdDialog", function ($scope, $mdDialog) {
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
        }],
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
  }]);

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
    this.params.url = '/';




    this.$get = function () {
      return this.params;
    };

  });


'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserController', [
    'userService', '$mdSidenav', '$mdBottomSheet', '$log', '$location',
    UserController
  ]);

/**
 * Main Controller for the Angular Material Starter App
 * @param $scope
 * @param $mdSidenav
 * @param avatarsService
 * @constructor
 */
function UserController( userService, $mdSidenav, $mdBottomSheet, $log, $location) {
  var self = this;

  self.selected     = null;
  self.menu        = [ ];
  self.toggleList   = toggleList;
  self.showContactOptions  = showContactOptions;
  self.goTo = goTo;

  // Load all registered users

  userService
    .loadMenuItems()
    .then( function( menu ) {
      self.menu    = [].concat(menu);
      self.selected = menu[0];
    });

  // *********************************
  // Internal methods
  // *********************************

  /**
   * First hide the bottomsheet IF visible, then
   * hide or Show the 'left' sideNav area
   */
  function toggleList() {
    var pending = $mdBottomSheet.hide() || $q.when(true);

    pending.then(function(){
      $mdSidenav('left').toggle();
    });
  }

  function goTo(li) {
    li.search = li.search || {};
    $location.path(li.path).search(li.search);
    toggleList()
  }


  /**
   * Show the bottom sheet
   */
  function showContactOptions($event) {
    var user = self.selected;

    return $mdBottomSheet.show({
      parent: angular.element(document.getElementById('body')),
      templateUrl: '/views/contactSheet.html',
      controller: [ '$mdBottomSheet', ContactPanelController],
      controllerAs: "cp",
      bindToController : true,
      targetEvent: $event
    }).then(function(clickedItem) {
      clickedItem && $log.debug( clickedItem.name + ' clicked!');
    });

    /**
     * Bottom Sheet controller for the Avatar Actions
     */
    function ContactPanelController( $mdBottomSheet ) {
      this.user = user;
      this.actions = [
        { name: 'Phone'       , icon: 'phone'       , icon_url: '/images/svg/phone.svg'},
        { name: 'Twitter'     , icon: 'twitter'     , icon_url: '/images/svg/twitter.svg'},
        { name: 'Google+'     , icon: 'google_plus' , icon_url: '/images/svg/google_plus.svg'},
        { name: 'Hangout'     , icon: 'hangouts'    , icon_url: '/images/svg/hangouts.svg'}
      ];
      this.submitContact = function(action) {
        $mdBottomSheet.hide(action);
      };
    }
  }

}
(function(){
  'use strict';

  angular.module('clientApp')
    .service('userService', ['$q', UserService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function UserService($q){
    var menu = [
      {
        name: 'All Shows',
        icon: '/images/svg/ic_list_black_24px.svg',
        path: '/all-shows'
      },
      {
        name: 'Configured Shows',
        icon: '/images/svg/ic_play_circle_filled_black_24px.svg',
        path: '/shows',
        search: {
          approved: true
        }
      },
      {
        name: 'Pending Shows',
        icon: '/images/svg/ic_play_circle_outline_black_24px.svg',
        path: '/shows',
        search: {
          approved: false
        }
      },
      {
        name: 'CheckIns',
        icon: '/images/svg/ic_library_add_24px.svg',
        path: '/checkin'
      },
      {
        name: 'Server Log',
        icon: '/images/svg/ic_library_books_24px.svg',
        path: '/logs/forever'
      },
      {
        name: 'FlexGet Log',
        icon: '/images/svg/ic_library_books_24px.svg',
        path: '/logs/flexget'
      }
    ];

    // Promise-based API
    return {
      loadMenuItems : function() {
        // Simulate async nature of real remote calls
        return $q.when(menu);
      }
    };
  }

})();

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

angular.module('clientApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/all_shows.html',
    "<div layout=\"row\" class=\"layout-wrap\" layout-padding=\"\"> <md-input-container flex-sm=\"100\" flex-md=\"33\"> <label>Search</label> <input ng-model=\"search\"> </md-input-container> </div> <div layout=\"row\" class=\"layout-wrap\" layout-fill id=\"shows\"> <div ng-repeat=\"show in shows | toArray: false | filter: search\" flex=\"100\" flex-gt-md=\"50\" flex-lg=\"50\" flex-gt-lg=\"33\"> <md-card ng-class=\"{ greyed: !show.approved }\"> <div class=\"card-image\"> <md-button class=\"md-fab md-mini edit-icon\" ng-click=\"editImage($event, show)\" aria-label=\"Edit Image\"> <md-icon md-svg-src=\"/images/svg/ic_mode_edit_white_18px.svg\"></md-icon> </md-button> <img ng-src=\"{{show.banner}}\" class=\"md-card-image\" alt=\"\"> </div> <md-card-content> <a href=\"{{'http://www.imdb.com/title/' + show.IMDB_ID}}\" target=\"_blank\"><h6 class=\"md-title\" ng-bind=\"show.title\"></h6></a> <span class=\"network\">{{show.Network}}</span> <span ng-show=\"show.matchingIssue\" style=\"color: #ff0000\">Issue matching title!</span> <div layout=\"row\"> <div flex=\"33\"> <md-input-container> <label>Id</label> <input disabled ng-model=\"show.id\"> </md-input-container> </div> <div flex=\"33\"> <md-input-container> <label>Season</label> <input ng-model=\"show.cSeason\"> </md-input-container> </div> <div flex=\"33\"> <md-input-container> <label>Episode</label> <input ng-model=\"show.cEpisode\"> </md-input-container> </div> </div> <div layout=\"row\" class=\"layout-wrap\"> <div flex-sm=\"50\" flex-gt-sm=\"40\"> <md-input-container> <label>Target</label> <input ng-model=\"show.target\"> </md-input-container> </div> <div flex-sm=\"50\" flex-gt-sm=\"40\"> <md-input-container> <label>Quality</label> <input ng-model=\"show.quality\"> </md-input-container> </div> <div flex-sm=\"50\" flex-gt-sm=\"20\"> <md-input-container> <label>Timeframe</label> <input type=\"number\" ng-model=\"show.timeframe\"> </md-input-container> </div> </div> </md-card-content> <div class=\"md-actions\" layout=\"row\" layout-align=\"end center\"> <md-button ng-click=\"showSample($event)\" title=\"Show sample qualities\" aria-label=\"Show sample qualities\" class=\"md-icon-button launch\"> <md-icon md-svg-src=\"/images/svg/ic_help_black_24px.svg\"></md-icon> </md-button> <!--<md-switch class=\"md-secondary\" ng-model=\"show.isApproved\" aria-label=\"Configure\">Configure</md-switch>--> <md-checkbox class=\"pull\" ng-model=\"show.isApproved\" aria-label=\"Configure\"> Configure </md-checkbox> <md-button ng-click=\"saveShow(show)\" class=\"md-fab md-mini md-secondary\" aria-label=\"Remove\"> <md-icon md-svg-src=\"/images/svg/ic_done_white_36px.svg\"></md-icon> </md-button> </div> </md-card> </div> </div>"
  );


  $templateCache.put('views/contactSheet.html',
    "<md-bottom-sheet class=\"md-list md-has-header\"> <md-subheader> Contact <span class=\"name\">{{ cp.user.name }}</span>: </md-subheader> <md-list> <md-item ng-repeat=\"item in cp.actions\"> <md-button ng-click=\"cp.submitContact(item)\" id=\"item_{{$index}}\"> <md-icon md-svg-icon=\"{{ item.icon_url }}\"></md-icon> {{item.name}} </md-button> </md-item> </md-list> </md-bottom-sheet>"
  );


  $templateCache.put('views/edit_image_dialog.tmpl.html',
    "<md-dialog aria-label=\"Banner Edit\"> <md-dialog-content> <md-input-container> <label>Image</label> <input ng-model=\"banner\" type=\"text\"> </md-input-container> </md-dialog-content> <div class=\"md-actions\" layout=\"row\"> <md-button ng-click=\"answer()\"> Cancel </md-button> <md-button ng-click=\"answer()\" style=\"margin-right:20px\"> Edit </md-button> </div> </md-dialog>"
  );


  $templateCache.put('views/forever.html',
    "<div class=\"line-main-container\" layout=\"column\" layout-fill=\"\" layout-wrap=\"\"> <div flex ng-repeat=\"line in foreverLogs track by $index\"> <div class=\"line {{ line.type }}\" ng-bind=\"line.line\"></div> </div> </div>"
  );


  $templateCache.put('views/main.html',
    "<!--{\\\"lastViewedAt\\\":\\\"1440179082\\\",\\\"parent\\\":\\\"Peppa Pig\\\",\\\"views\\\":\\\"4\\\",\\\"show_id\\\":\\\"79222\\\",\\\"season_number\\\":\\\"2\\\",\\\"number\\\":\\\"26\\\"}--> <div id=\"checkin\" layout=\"row\" class=\"layout-wrap\"> <div ng-repeat=\"show in shows\" flex-sm=\"50\" flex-md=\"33\" flex-gt-md=\"25\"> <md-card> <div class=\"card-image\"> <img ng-src=\"{{show.art}}\" class=\"md-card-image\" alt=\"\"> </div> <md-card-content> <h6 class=\"md-title\" ng-bind=\"show.parent\"></h6> <span class=\"checkin-date\" ng-bind=\"formatDate(show.lastViewedAt)\"></span> <div layout=\"row\"> <div flex=\"30\" class=\"heading\"> Season </div> <div flex=\"70\" class=\"text-right\"> <span ng-bind=\"(parseInt(show.season_number, 10) < 10 ? '0' + show.season_number : show.season_number)\"></span> </div> </div> <div layout=\"row\"> <div flex=\"30\" class=\"heading\"> Episode </div> <div flex=\"70\" class=\"text-right\"> <span ng-bind=\"(parseInt(show.number, 10) < 10 ? '0' + show.number : show.number)\"></span> </div> </div> <div layout=\"row\"> <div flex=\"30\" class=\"heading\"> Views </div> <div flex=\"70\" class=\"text-right\"> <span ng-bind=\"show.views\"></span> </div> </div> <!--<div layout=\"row\">--> <!--<div flex=\"30\" class=\"heading\">--> <!--Viewed--> <!--</div>--> <!--<div flex=\"70\" class=\"text-right\">--> <!--<span ng-bind=\"formatDate(show.lastViewedAt)\"></span>--> <!--</div>--> <!--</div>--> </md-card-content> </md-card> </div> </div>"
  );


  $templateCache.put('views/shows.html',
    "<div layout=\"row\" class=\"layout-wrap\" layout-padding=\"\"> <md-input-container flex-sm=\"100\" flex-md=\"33\"> <label>Search</label> <input ng-model=\"search\"> </md-input-container> </div> <div layout=\"row\" class=\"layout-wrap\" layout-fill id=\"shows\"> <div ng-repeat=\"show in shows | toArray: false | filter: search | filter: {approved: filterApproved}\" flex=\"100\" flex-gt-md=\"50\" flex-lg=\"50\" flex-gt-lg=\"33\"> <md-card ng-class=\"{ greyed: !show.approved }\"> <div class=\"card-image\"> <md-button class=\"md-fab md-mini edit-icon\" ng-click=\"editImage($event, show)\" aria-label=\"Edit Image\"> <md-icon md-svg-src=\"/images/svg/ic_mode_edit_white_18px.svg\"></md-icon> </md-button> <img ng-src=\"{{show.banner}}\" class=\"md-card-image\" alt=\"\"> </div> <md-card-content> <a href=\"{{'http://www.imdb.com/title/' + show.IMDB_ID}}\" target=\"_blank\"><h6 class=\"md-title\" ng-bind=\"show.title\"></h6></a> <span class=\"network\">{{show.Network}}</span> <span ng-show=\"show.matchingIssue\" style=\"color: #ff0000\">Issue matching title!</span> <div layout=\"row\"> <div flex=\"33\"> <md-input-container> <label>Id</label> <input disabled ng-model=\"show.id\"> </md-input-container> </div> <div flex=\"33\"> <md-input-container> <label>Season</label> <input ng-model=\"show.cSeason\"> </md-input-container> </div> <div flex=\"33\"> <md-input-container> <label>Episode</label> <input ng-model=\"show.cEpisode\"> </md-input-container> </div> </div> <div layout=\"row\" class=\"layout-wrap\"> <div flex-sm=\"50\" flex-gt-sm=\"40\"> <md-input-container> <label>Target</label> <input ng-model=\"show.target\"> </md-input-container> </div> <div flex-sm=\"50\" flex-gt-sm=\"40\"> <md-input-container> <label>Quality</label> <input ng-model=\"show.quality\"> </md-input-container> </div> <div flex-sm=\"50\" flex-gt-sm=\"20\"> <md-input-container> <label>Timeframe</label> <input type=\"number\" ng-model=\"show.timeframe\"> </md-input-container> </div> </div> </md-card-content> <div class=\"md-actions\" layout=\"row\" layout-align=\"end center\"> <md-button ng-click=\"showSample($event)\" title=\"Show sample qualities\" aria-label=\"Show sample qualities\" class=\"md-icon-button launch\"> <md-icon md-svg-icon=\"/images/svg/ic_help_black_24px.svg\"></md-icon></md-button> <!--<md-switch class=\"md-secondary\" ng-model=\"show.isApproved\" aria-label=\"Configure\">Configure</md-switch>--> <md-checkbox ng-model=\"show.isApproved\" aria-label=\"Configure\"> Configure </md-checkbox> <md-button class=\"md-primary md-raised\" ng-click=\"saveShow(show)\">Save</md-button> </div> </md-card> </div> </div>"
  );


  $templateCache.put('views/toast.html',
    "<md-toast> <span flex>Custom toast!</span> <md-button ng-click=\"closeToast()\"> Close </md-button> </md-toast>"
  );

}]);
