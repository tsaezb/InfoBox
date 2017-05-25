'use strict';

/**
 * @ngdoc overview
 * @name infoBoxApp
 * @description
 * # infoBoxApp
 *
 * Main module of the application.
 */
angular
  .module('infoBoxApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
