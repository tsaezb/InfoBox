'use strict';

/**
 * @ngdoc function
 * @name infoBoxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the infoBoxApp
 */
angular.module('infoBoxApp')
  .controller('MainCtrl', function ($scope, $uibModal, $http){

    $scope.regex = /^[\d]+$/;
    $scope.data_flag = false;
    $scope.alerts = [];


    //add form for this field later
    $scope.lang = "en";
    $scope.strategy = "baseline";

    $scope.addAlert = function(str) {
      if ($scope.alerts !== []) {
        $scope.alerts = [];
        $scope.alerts.push({ type: 'danger', msg: str });
      }
      else {
        $scope.alerts.push({ type: 'danger', msg: str });
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.contact_info = [
      {
        "header": "Developer",
        "data": "Tomás Sáez Binelli"
      },{
        "header": "Email",
        "data": "tomas.saezbin@gmail.com"
      },{
        "header": "Teacher",
        "data": "Aidan Hogan"
      }
    ];

    $scope.open_contact_us = function(){
      $uibModal.open({
        templateUrl: 'views/contact-us.html',
        scope: $scope,
        size: 'md'
      }).result.then(function(){}, function(r){});
    };

    $scope.get_entity_info = function(id, lang, strat){
      $scope.get_wikidata_info(id, lang, strat);
    };

    //quering function
    $scope.get_wikidata_info = function(id, lang, strat){

      //$http.get("https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=" + encodeURI(query))
      $http({
        url:'http://localhost:8000/entity?id='+ id + '&lang=' + lang + '&strategy=' + strat,
        method: 'GET',
        withCredentials: false
      }).then(function(response){
          if(response.data.length !== 0){
            $scope.alerts = [];
            $scope.data_flag = true;
            $scope.entity_label = response.data.label;
            $scope.entity_description = response.data.description;
            $scope.info_box = response.data.properties;
          }

          else{
            $scope.addAlert("The entity does not exist!");
          }
        },function(err){
          $scope.addAlert("There was an error processing the query!");
        });
    };
  });
