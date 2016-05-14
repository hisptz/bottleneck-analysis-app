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