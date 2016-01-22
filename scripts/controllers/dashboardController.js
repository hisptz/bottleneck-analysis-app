var dashboardController  = angular.module('dashboardController',[]);
dashboardController.controller('DashboardController',['$scope','dashboardsManager','dashboardItemsManager',
    '$routeParams','$modal','$timeout','$translate','$anchorScroll','Paginator','ContextMenuSelectedItem',
    '$filter','$http','GridColumnService','CustomFormService','ModalService','DialogService','DHIS2URL',function($scope,
                                                        dashboardsManager,
                                                        dashboardItemsManager,
                                                        $routeParams,
                                                        $modal,
                                                        $timeout,
                                                        $translate,
                                                        $anchorScroll,
                                                        Paginator,
                                                        ContextMenuSelectedItem,
                                                        $filter,
                                                        $http,
                                                        GridColumnService,
                                                        CustomFormService,
                                                        ModalService,
                                                        DialogService,
                                                        DHIS2URL
    ){

        $scope.loading = true;
        dashboardsManager.getDashboard($routeParams.dashboardid).then(function(dashboard){
            console.log(dashboard);
            $scope.dashboardItems = dashboard.dashboardItems;
            angular.forEach($scope.dashboardItems,function(value){
                value.column_size = $scope.getColumnSize(value.shape);
            })
            $scope.loading=false;
        });
        //$scope.column_size
        $scope.getColumnSize = function(shapeSize){

            var size=12;//Default size
            if(angular.lowercase(shapeSize)=="double_width") {
                size=8;
            }else if(angular.lowercase(shapeSize)=="full_width"){
                size=12;
            }else if(angular.lowercase(shapeSize)=="normal") {
                size=4;
            }
            return 'col-md-'+size;
        };
        $scope.cardClassResizable=function(shapeSize,dashboardItem){
            var size=shapeSize.split("-").pop();
            var sizeCol='';
            var sizeName='';
            if(size==12){
                sizeCol='col-md-4';
                sizeName="NORMAL";
            }else if(size==8){
                sizeCol='col-md-12';
                sizeName="FULL_WIDTH";
            }else if(size==4){
                sizeCol='col-md-8';
                sizeName="DOUBLE_WIDTH";
            }
              console.log(sizeName)
            dashboardItem.column_size =$scope.getColumnSize(sizeName);

        }
        $scope.getDashboardItem = function(dashboardItem) {
            return dashboardItem[dashboardItem.type];
        }

    }])
