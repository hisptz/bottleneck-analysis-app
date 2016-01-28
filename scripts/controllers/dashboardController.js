var dashboardController  = angular.module('dashboardController',[]);
dashboardController.controller('DashboardController',['$scope','dashboardsManager','dashboardItemsManager',
    '$routeParams','$modal','$timeout','$translate','$anchorScroll','Paginator','ContextMenuSelectedItem',
    '$filter','$http','GridColumnService','CustomFormService','ModalService','DialogService','DHIS2URL','chartsManager',
    'TableRenderer',function($scope,
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
                                                        DHIS2URL,
                                                        chartsManager,
                                                        TableRenderer
    ){

        $scope.loading = true;
        $scope.dashboardChart=[];
        dashboardsManager.getDashboard($routeParams.dashboardid).then(function(dashboard){
            $scope.dashboardItems = dashboard.dashboardItems;
           angular.forEach($scope.dashboardItems,function(value){
                value.column_size = $scope.getColumnSize(value.shape);
            $scope.getAnalytics(value, 608, false )

                value.labelCard=$scope.getCardSize(value.shape);
            })
            console.log($scope.dashboardItems);

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
            var labelCard='';
            var sizeCol='';
            var sizeName='';
            if(size==12){
                sizeCol='col-md-4';
                sizeName="NORMAL";
                labelCard='Small';
            }else if(size==8){
                sizeCol='col-md-12';
                sizeName="FULL_WIDTH";
                labelCard='Large';
            }else if(size==4){
                sizeCol='col-md-8';
                sizeName="DOUBLE_WIDTH";
                labelCard='Medium';
            }
              console.log(sizeName)
            dashboardItem.column_size =$scope.getColumnSize(sizeName);
            dashboardItem.labelCard =labelCard;
        }
        $scope.getCardSize=function(shapeSize){
            var labelCard='';
            if(angular.lowercase(shapeSize)=="double_width") {
                labelCard='Medium';
            }else if(angular.lowercase(shapeSize)=="full_width"){
                labelCard='Large';
            }else if(angular.lowercase(shapeSize)=="normal") {
                labelCard='Small';
            }
            return labelCard;
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

            if ( "CHART" == dashboardItem.type )
            {

                DHIS.getChart({
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
                }).then(function(result){
                    console.log('DHIS:');
                    dashboardItem.analyticsUrl = window.alayticsUrl;
                    $http.get('../../../'+dashboardItem.analyticsUrl)
                        .success(function(analyticsData){
                            console.info(analyticsData);
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawOtherCharts(analyticsData,'ou','dx','none','','YES','column');
                         });
                });
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
                }).then(function(result){
                    dashboardItem.analyticsUrl = window.alayticsUrl;
                    dashboardItem.tableName=window.tableName;
                    $scope.name=dashboardItem.tableName;
                    $http.get('../../../'+dashboardItem.analyticsUrl)
                        .success(function(analyticsData){
                            $scope.dashboardTab= TableRenderer.drawTableWithTwoColumnDimension(analyticsData,'ou','dx','pe');
                            //$('.dashboardTable').html($scope.dashboardTab);
                    });
                });
            }
        }

    }])
