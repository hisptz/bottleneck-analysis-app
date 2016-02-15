var dashboardController  = angular.module('dashboardController',[]);
dashboardController.controller('DashboardController',['$scope','dashboardsManager','dashboardItemsManager',
    '$routeParams','$modal','$timeout','$translate','$anchorScroll','Paginator','ContextMenuSelectedItem',
    '$filter','$http','GridColumnService','CustomFormService','ModalService','DialogService','DHIS2URL','mapManager','chartsManager',
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
                                                        mapManager,
                                                        chartsManager,
                                                        TableRenderer
    ){

        $scope.loading = true;
        $scope.dashboardChart=[];
        $scope.dashboardTab=[];
        $scope.headers=[];
        $scope.firstColumn=[];
        $scope.secondColumn=[];
        $scope.number=[];
        $scope.column=[];
        $scope.firstRow=[];
        $scope.subRow=[];
        dashboardsManager.getDashboard($routeParams.dashboardid).then(function(dashboard){
            $scope.dashboardItems = dashboard.dashboardItems;
           angular.forEach($scope.dashboardItems,function(value){
                value.column_size = $scope.getColumnSize(value.shape);
            $scope.getAnalytics(value, 608, false )

                value.labelCard=$scope.getCardSize(value.shape);
            })

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
            //console.log(dashboardItem.type);
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
                    //console.log('DHIS:');
                    dashboardItem.object=window.object;
                    dashboardItem.analyticsUrl = window.alayticsUrl;
                    $http.get('../../../'+dashboardItem.analyticsUrl)
                        .success(function(analyticsData){
                            var chartType=(dashboardItem.object.type).toLowerCase();
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawOtherCharts(analyticsData,dashboardItem.object.category,[],dashboardItem.object.series,[],'none','',dashboardItem.object.name,chartType);
                            console.warn(chartType)
                            console.warn($scope.dashboardChart[dashboardItem.id])
                        });
                });
            }
            else if ( "MAP" == dashboardItem.type )
            {

                DHIS.getMap({
                    url: '..',
                    el: 'plugin-' + dashboardItem.id,
                    id: dashboardItem.map.id,
                    hideLegend: true,
                    dashboard: true,
                    crossDomain: false,
                    skipMask: true,
                    userOrgUnit: userOrgUnit
                    }).then(function(output){
                    var shared = mapManager.getShared();
                    shared.facility = 3029;
                    mapManager.pushMapViews(output).then(function(response){
                        var analyticsObject = response.data;
                        var mapViews = analyticsObject.mapViews;

                        var layerProperties = mapManager.getLayerProperties(mapViews);
                        console.log(layerProperties);
                        // get user orgunits and childrens
                        mapManager.getUserOrgunit().then(function (response) {
                            var userOrgUnit = response.data[0].children;

                            mapManager.prepareMapLayers(mapViews,userOrgUnit).then(function(thematicLayer,boundaryLayer){
                                var boundary = [];



                                boundaryLayer.success(function(boundaryData){

                                    boundary = mapManager.getGeoJson(boundaryData);
                                    dashboardItem.map = {};
                                    var latitude = output.latitude/100000;
                                    var longitude = output.longitude/100000;
                                    var zoom = output.zoom-1;

                                    // process thematic layers
                                    thematicLayer.success(function(thematicData){
                                        console.log(" THEMATIC LAYER ");
        //                                angular.
                                        console.log(thematicData);
                                    });


                                    angular.extend(dashboardItem.map, {
                                        Africa: {
                                            zoom: zoom,
                                            lat: latitude,
                                            lon: longitude
                                        },
                                        layers:[
                                            {
                                                name:'OpenStreetMap',
                                                source: {
                                                    type: 'OSM',
                                                    //url:"http://tile.openstreetmap.org/#map=" + zoom + "/" + longitude + "/" + latitude
                                                    url:"http://developer.mapquest.com/content/osm/mq_logo.png/#map=" + zoom + "/" + longitude + "/" + latitude
                                                }
                                            } ,
                                            {
                                                name:'geojson',
                                                source: {
                                                    type: 'GeoJSON',
                                                    geojson: {
                                                        object: boundary
                                                    }
                                                },
                                                style: ""
                                            }
                                        ],
                                        defaults: {
                                            events: {
                                                layers: [ 'mousemove', 'click']
                                            }
                                        }
                                    });
                                })

                                thematicLayer.error(function(response){
                                    //console.log(response);
                                });

                                boundaryLayer.error(function(response){
                                    //console.log(response);
                                });



                            });
                        }, function (error) {

                        });



                    },function(){

                    });
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
                }).then(function(result) {
                    dashboardItem.analyticsUrl = window.alayticsUrl;
                    dashboardItem.object = window.object;
                    dashboardItem.tableName = window.tableName;
                    $scope.name = dashboardItem.tableName;
                    var column = {};
                    var rows = {};
                    var filters = {};
                    var headerArray=[];
                    $http.get('../../..'+dashboardItem.analyticsUrl)
                            .success(function(analyticsData){
                            angular.forEach(dashboardItem.object.rows,function(row){
                                rows['rows']=row.dimension;
                            });
                            angular.forEach(dashboardItem.object.columns, function (col) {
                                column['column'] = col.dimension;
                            });
                            angular.forEach(dashboardItem.object.filters,function(filter){
                                filters['filters']=filter.dimension;
                            });
                            if (dashboardItem.object.columns.length == 2){
                                $scope.number[dashboardItem.id]='2';
                                var firstDimension=dashboardItem.object.columns[0].dimension;
                                var secondDimension=dashboardItem.object.columns[1].dimension;
                                var subcolumnsLength = TableRenderer.prepareCategories(analyticsData, secondDimension).length;
                                var firstColumn=[];
                                var secondColumn=[];
                                angular.forEach(TableRenderer.prepareCategories(analyticsData, firstDimension), function (columnName) {
                                    firstColumn.push({"name":columnName.name,"uid":columnName.uid,"length":subcolumnsLength})
                                 });
                                var subColumn=[];
                                angular.forEach(TableRenderer.prepareCategories(analyticsData, firstDimension), function (columnName) {
                                         angular.forEach(TableRenderer.prepareCategories(analyticsData, secondDimension), function (subColName) {
                                            subColumn.push({"name":subColName.name,"uid":subColName.uid,"length":subcolumnsLength,"parentCol":columnName.name});
                                        });
                                     });
                                $scope.firstColumn[dashboardItem.id]=firstColumn;
                                $scope.secondColumn[dashboardItem.id]=subColumn;
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension(analyticsData,rows.rows,firstDimension,secondDimension);
                            }else if(dashboardItem.object.rows.length == 2){
                                $scope.number[dashboardItem.id]='3';
                                var firstRow=dashboardItem.object.rows[0].dimension;
                                var secondRow=dashboardItem.object.rows[1].dimension;
                                var subrowsLength = TableRenderer.prepareCategories(analyticsData, secondRow).length;
                                var headers=[];
                                var firstRows=[];
                                var subRow=[];
                                angular.forEach(TableRenderer.prepareCategories(analyticsData, column.column), function (columnName) {
                                    headers.push({"name":columnName.name,"uid":columnName.uid});
                                 });
                                angular.forEach(TableRenderer.prepareCategories(analyticsData, firstRow), function (rowName) {
                                    firstRows.push({"name":rowName.name,"uid":rowName.uid,"length":subrowsLength});
                                 });
                                $scope.column[dashboardItem.id]=headers;
                                $scope.firstRow[dashboardItem.id]=firstRows;
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension(analyticsData,firstRow,column.column,secondRow);
                            }else{
                                $scope.number[dashboardItem.id]='1';
                                var metadata=TableRenderer.getMetadataArray(analyticsData,column.column);
                                angular.forEach(metadata,function(headers){
                                    headerArray.push({"name":analyticsData.metaData.names[headers],"id":headers});
                                });
                                $scope.headers[dashboardItem.id]=headerArray;
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw(analyticsData,rows.rows,column.column);
                            }
                    });
                });
            }
        }
    }])
