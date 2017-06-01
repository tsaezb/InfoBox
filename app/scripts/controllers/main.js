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
      var q = "SELECT ?prop ?val WHERE { " + id + " ?prop ?val . }";

      $http.get("https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=" + encodeURI(q))
        .then(function(data){
          if(data.data.results.bindings.length !== 0){
            $scope.alerts = [];
            $scope.data_flag = true;
            $scope.entity_id = id;
            $scope.entity_data = data.data.results.bindings;
            console.log($scope.entity_data);
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
