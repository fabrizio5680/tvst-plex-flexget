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
  .config(function ($routeProvider, $mdThemingProvider, $mdIconProvider) {
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
  });
