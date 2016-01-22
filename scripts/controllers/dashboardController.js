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
            $scope.loading=false;
        });
        $scope.getColumnSize = function(sizeName){
            var size=12;//Default size
            if(angular.lowercase(sizeName)=="double_width") {
                size=8;
            }else if(angular.lowercase(sizeName)=="full_width"){
                size=12;
            }else if(angular.lowercase(sizeName)=="normal") {
                size=4;
            }
            return 'col-md-'+size;
        };
        $scope.cardClassResizable=function(cardSize){
            var size=cardSize.split("-").pop();
            var sizeCol='';
            if(size==12){
                sizeCol='col-md-4';
            }else if(size==8){
                sizeCol='col-md-12';
            }else if(size==4){
                sizeCol='col-md-8';
            }
            console.log(sizeCol);
            console.info(cardSize);

            $scope.sizeColumn=sizeCol;

        }
        $scope.getDashboardItem = function(dashboardItem) {
            return dashboardItem[dashboardItem.type];
        }

    }])
