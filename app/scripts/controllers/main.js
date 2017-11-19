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

    $scope.langs = [
      { "val": "en"},
      { "val": "es"}
    ];

    $scope.language = $scope.langs[0];

    $scope.strats = [
      { "val": "baseline"},
      { "val": "frecuency"},
      { "val": "pagerank"},
      { "val": "multiplicative"},
      { "val": "sum"}
    ];

    $scope.strategy = $scope.strats[0];

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
      $scope.data_flag = false;
      $scope.get_wikidata_info(id, lang, strat);
    };

    $scope.group_properties = function(prop){
      var mapping = {};

      for (var i = 0; i <= prop.length - 1; i++) {
        if (prop[i].prop.value in mapping) {
          mapping[prop[i].prop.value].values += (', ' + prop[i].valLabel.value);
        }
        else {
          mapping[prop[i].prop.value] = {
            "label" : prop[i].pLabel.value,
            "values" : prop[i].valLabel.value,
            "index" : i
          };
        }
      }
      return _.values(mapping);
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

            if ('description' in response.data) {
              $scope.entity_description = response.data.description;
            }
            else {
              $scope.entity_description = undefined;
            }

            if ('image' in response.data) {
              $scope.entity_image = response.data.image;
            }
            else {
              $scope.entity_image = undefined;
            }

            $scope.info_box = $scope.group_properties(response.data.properties);
          }

          else{
            $scope.addAlert("The entity does not exist!");
          }
        },function(err){
          $scope.addAlert("There was an error processing the query!");
        });
    };
  });
