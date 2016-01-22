
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

            $scope.dashboardItems = dashboard.dashboardItems;
            console.log($scope.dashboardItems);
           angular.forEach($scope.dashboardItems,function(value){
                value.column_size = $scope.getColumnSize(value.shape);
               $scope.getAnalytics(value, 408, false )

            });
            $scope.loading=false;
        });
        //$scope.column_size

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

        $scope.getAnalytics = function( dashboardItem, width, prepend )
        {
            console.log(dashboardItem.type);
            width = width || 408;
            prepend = prepend || false;

            var graphStyle = "width:" + width + "px; overflow:hidden;";
            var tableStyle = "width:" + width + "px;";
            var userOrgUnit =  [];

            if ( "CHART" == dashboardItem.type && dashboardItem.chart.id !== 'BFi8AtKeIkU' )
            {

                console.log(DHIS.getChart({
                    url: '../../../',
                    el: 'plugin-' + dashboardItem.id,
                    id: dashboardItem.chart.id,
                    width: width,
                    height: 308,
                    dashboard: true,
                    crossDomain: false,
                    skipMask: true,
                    userOrgUnit: userOrgUnit,
                    domainAxisStyle: {
                        labelRotation: 45,
                        labelFont: '10px sans-serif',
                        labelColor: '#111'
                    },
                    rangeAxisStyle: {
                        labelFont: '9px sans-serif'
                    },
                    legendStyle: {
                        labelFont: 'normal 10px sans-serif',
                        labelColor: '#222',
                        labelMarkerSize: 10,
                        titleFont: 'bold 12px sans-serif',
                        titleColor: '#333'
                    },
                    seriesStyle: {
                        labelColor: '#333',
                        labelFont: '9px sans-serif'
                    }
                }));
            }
            else if ( "MAP" == dashboardItem.type )
            {

                DHIS.getMap({
                    url: '../../../',
                    el: 'plugin-' + dashboardItem.id,
                    id: dashboardItem.map.id,
                    hideLegend: true,
                    dashboard: true,
                    crossDomain: false,
                    skipMask: true,
                    mapViews: [{
                        userOrgUnit: userOrgUnit
                    }]
                });
            }
            else if ( "REPORT_TABLE" == dashboardItem.type )
            {

                DHIS.getTable({
                    url: '../../../',
                    el: 'plugin-' + dashboardItem.id,
                    id: dashboardItem.reportTable.id,
                    dashboard: true,
                    crossDomain: false,
                    skipMask: true,
                    displayDensity: 'compact',
                    fontSize: 'small',
                    userOrgUnit: userOrgUnit
                });
            }
        }

    }])
