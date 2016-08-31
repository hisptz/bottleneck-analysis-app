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
        controller: function($scope,$http,$q,$sce) {
            $scope.loading=true;
            var deferred = $q.defer();
            var ajaxCalls = [];
            $scope.dashboardItemMediaUrl = $sce.trustAsResourceUrl('../../../api/apps/social-media-video/index.html?dashboardItemId='+$scope.dashboardItem.id);
            //Force normal size of card
            $scope.dashboardItem.shape= "NORMAL";

            //Load messages
            if($scope.dashboardItem.type=='MESSAGES') {
                ajaxCalls.push($http.get('../../../api/messageConversations.json?fields=:identifiable,messageCount,userSurname,userFirstname,lastMessage&pageSize=10')
                    .success(function(data){
                        $scope.dashboardItem.messageConversations=data.messageConversations;
                        $scope.loading=false;
                    }).error(function(error){
                        $scope.errorMessage = true;
                    }));
            }else {
                ajaxCalls.push($http.get('../../../api/dashboardItems/'+$scope.dashboardItem.id+'.json?fields=:all,users[:identifiable],resources[:identifiable],reports[:identifiable]')
                    .success(function(data){
                        $scope.dashboardItem=data;
                    }).error(function(error){
                        $scope.loading=false;
                        $scope.errorMessage = true;
                    }));
            }

            $q.all(ajaxCalls).then( function(results) {
                $scope.loading=false;
                deferred.resolve();
            },function(errors) {
                deferred.reject(errors);
            });


        } //Embed a custom controller in the directive
        //link: function ($scope, element, attrs) { } //DOM manipulation
    }
});