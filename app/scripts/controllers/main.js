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

    $scope.get_entity_info = function(id, lang){
      $scope.get_wikidata_info(id, lang);
    };

    //quering function
    $scope.get_wikidata_info = function(id, lang){

      //$http.get("https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=" + encodeURI(query))
      $http({
        url:'http://localhost:8000/entity?id='+ id + '&lang=' + lang,
        method: 'GET',
        withCredentials: false
      }).then(function(response){
          if(response.data.length !== 0){
            $scope.alerts = [];
            $scope.data_flag = true;
            $scope.entity_data = response.data;

            $scope.info_box = $scope.filter_properties(response.data, lang);

            //random order & select first 10
            $scope.info_box = $scope.baseline_infobox($scope.info_box);
          }

          else{
            $scope.addAlert("The entity does not exist!");
          }
        },function(err){
          $scope.addAlert("There was an error processing the query!");
        });
    };


    //filter function
    $scope.filter_properties = function(properties_list, lang){

      var filtered_pairs = [];

      for (var i = 0; i < properties_list.length; i++) {

        //ignoring non-direct properties
        if (properties_list[i].pLabel.value.indexOf("http://www.wikidata.org/prop/P") === 0) {}

        //adding direct properties
        else if (properties_list[i].pLabel.value.indexOf("http://www.wikidata.org/prop/direct") === 0) {
          filtered_pairs.push(properties_list[i]);
        }

            //check for literals in given language
        else if (properties_list[i].val.type === "literal"){

          if (properties_list[i].val["xml:lang"] === lang || properties_list[i].datatype === "http://www.w3.org/2001/XMLSchema#integer" || properties_list[i].val["xml:lang"] === undefined){
            filtered_pairs.push(properties_list[i]);
          }
        }
      }

      return filtered_pairs;
    };

    //this function creates the baseline infobox for each entity, selecting 10 properties at random
    $scope.baseline_infobox = function(properties){
      //add label as 1rst
      return _.shuffle(properties).slice(0,10);
    };


    });
