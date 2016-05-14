'use strict';

/* Directives */

var idashboardDirectives = angular.module('idashboardDirectives', []);
idashboardDirectives.directive('targetSelect', function() {
    var controller = ['$scope',function ($scope) {
        function init() {
            $scope.items = angular.copy($scope.datasource);
        }

        init();
        $scope.onTargetSelect = function($item){
            $scope.ngTargetModel = $item.id;
        }
        $scope.data = {
            selected:[],
            multiSelectEvents: {
                "onItemSelect":$scope.onTargetSelect
            }
        };
        if($scope.ngTargetModel != ""){
            $scope.data.selected = {"id":$scope.ngTargetModel};
        }
    }];


    return {
        scope: {
            ngTargetModel: '=',
            options: '='
        },
        controller: controller,
        templateUrl: 'views/partials/target-select.html'

    };
});
idashboardDirectives.directive('targetTable',function(){
   return {
       restrict:"EA",
       templateUrl:"views/partials/dashboardTable.html",
       replace:true,
       transclude:true
   }
});
idashboardDirectives.directive('targetDetails',function(){
    return {
        restrict:"EA",
        templateUrl:"views/partials/dashboardDetails.html",
        replace:true,
        transclude:true
    }
});
idashboardDirectives.directive('listingItem', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            dashboardItem:'=',
            loading:'=',
            errorMessage:'='
        },
        replace: true,
        //transclude:true,
        templateUrl: 'views/partials/listingItem.html',
        controller: function($scope,$http) {
            //Load messages
            $http.get('../../../api/messageConversations.json?fields=:all&pageSize=5')
                .success(function(data){
                    $scope.dashboardItem.messageConversations=data.messageConversations;
                    $scope.loading=false;
                }).error(function(error){
                    $scope.loading=false;
                    $scope.errorMessage = true;
                });

        } //Embed a custom controller in the directive
        //link: function ($scope, element, attrs) { } //DOM manipulation
    }
});