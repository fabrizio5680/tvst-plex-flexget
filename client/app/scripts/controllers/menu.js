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
