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

    $scope.get_entity_info = function(id){
      id = "wd:Q" + id;
      var q = "SELECT ?pLabel ?val WHERE { " + id + " ?prop ?val . ?ps wikibase:directClaim ?prop . ?ps rdfs:label ?pLabel . FILTER((LANG(?pLabel)) = 'en')}";

      $http.get("https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=" + encodeURI(q))
        .then(function(data){
          if(data.data.results.bindings.length !== 0){
            $scope.alerts = [];
            $scope.data_flag = true;
            $scope.entity_id = id;
            $scope.entity_data = data.data.results.bindings;

            $scope.info_box = [];
            //filtering by prop type & lang
            for (var i = 0; i < $scope.entity_data.length; i++) {
              if ($scope.entity_data[i].pLabel.value.indexOf("http://www.wikidata.org/prop/P") === 0) {
              }
              else if ($scope.entity_data[i].pLabel.value.indexOf("http://www.wikidata.org/prop/direct") === 0) {
                $scope.info_box.push($scope.entity_data[i]);
              }
              else if ($scope.entity_data[i].val.type === "literal"){
                if ($scope.entity_data[i].val["xml:lang"] === "en" || $scope.entity_data[i].datatype === "http://www.w3.org/2001/XMLSchema#integer" || $scope.entity_data[i].val["xml:lang"] === undefined){
                  $scope.info_box.push($scope.entity_data[i]);
                }
              }
            }
            //random order & select first 10
            $scope.info_box = _.shuffle($scope.info_box).slice(0,10);
          }
          else{
            $scope.addAlert("The entity does not exist!");
          }
        },
        function(err){
          $scope.addAlert("There was an error processing the query!");
        });

    };

  });
