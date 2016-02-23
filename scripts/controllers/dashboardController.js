var dashboardController  = angular.module('dashboardController',[]);
dashboardController.controller('DashboardController',['$scope','dashboardsManager','dashboardItemsManager',
    '$routeParams','$timeout','$translate','Paginator','ContextMenuSelectedItem',
    '$filter','$http','CustomFormService','DHIS2URL', 'olHelpers',
    'olData','mapManager','chartsManager','TableRenderer','filtersManager',function($scope,
                                                        dashboardsManager,
                                                        dashboardItemsManager,
                                                        $routeParams,
                                                        $timeout,
                                                        $translate,
                                                        Paginator,
                                                        ContextMenuSelectedItem,
                                                        $filter,
                                                        $http,
                                                        CustomFormService,
                                                        DHIS2URL,
                                                        olHelpers,
                                                        olData,
                                                        mapManager,
                                                        chartsManager,
                                                        TableRenderer,
                                                        filtersManager

    ){

        $scope.loading = true;
        $scope.dashboardChart = [];
        $scope.dashboardDataElements = [];
        $scope.dashboardAnalytics = [];
        $scope.dashboardLoader = [];
        $scope.dashboardChartType = [];
        $scope.dashboardTab = [];
        $scope.headers = [];
        $scope.firstColumn = [];
        $scope.secondColumn = [];
        $scope.tableDimension = [];
        $scope.tableRowDimension = [];
        $scope.tableOneDimensionBoth = [];
        $scope.icons = filtersManager.icons;

        var d = new Date();
        //default filter values
        $scope.yearValue = d.getFullYear();
        $scope.periodType = "Yearly";
        $scope.radioValue = 'all';
        $scope.tableColumn = 'ou';
        $scope.tableRow = 'dx';
        $scope.chartXAxis = 'ou';
        $scope.chartYAxis = 'dx';

        /**
         *
         * Filters Specification
         */
        $scope.popover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!'};



        $scope.data = [];
        $scope.loadOrgunits = false;
        filtersManager.getOrgUnits().then(function(data){
            $scope.data.orgUnitTree = filtersManager.getOtgunitTree(data);
            $scope.loadOrgunits = true;
        });

        $scope.selectOnly1Or3 = function(item, selectedItems) {
            if (selectedItems  !== undefined && selectedItems.length >= 20) {
                return false;
            } else {
                return true;
            }
        };

        $scope.selectOnly1Or3 = function(item, selectedItems) {
            if (selectedItems  !== undefined && selectedItems.length >=12) {
                return false;
            } else {
                return true;
            }
        };

        $scope.filtersHidden = false;
        $scope.hideFilters = function(){
            if($scope.filtersHidden == true){
                $scope.filtersHidden = false
            }else if($scope.filtersHidden == false){
                $scope.filtersHidden = true
            }
        }

        $scope.changePeriodType = function(type){
            $scope.periodType = type;
            $scope.getPeriodArray(type);
        };

        //add year by one
        $scope.nextYear = function () {
            $scope.yearValue = parseInt($scope.yearValue) + 1;
            $scope.getPeriodArray($scope.periodType);
        }
        //reduce year by one
        $scope.previousYear = function () {
            $scope.yearValue = parseInt($scope.yearValue) - 1;
            $scope.getPeriodArray($scope.periodType);
        }

        //popup model
        $scope.openModel = function (size) {
            $('#'+size).modal('show');
            $scope.$broadcast('highchartsng.reflow');
        };



        $scope.getPeriodArray = function(type){
            var year = $scope.yearValue;
            $scope.periods = filtersManager.getPeriodArray(type,year);
        };
        $scope.getPeriodArray($scope.periodType);

        //abstract dashboard name
        $scope.getDashboardName = function(dashboard){
            var name = "";
            if(dashboard.type == "REPORT_TABLE"){
                name = dashboard.reportTable.displayName;
            }if(dashboard.type == "CHART"){
                name = dashboard.chart.displayName;
            }if(dashboard.type == "MAP"){
                name = dashboard.map.displayName;
            }
            return name;
        };


        $scope.column=[];
        $scope.firstRow=[];
        $scope.subRow=[];
        dashboardsManager.getDashboard($routeParams.dashboardid).then(function(dashboard){
            $scope.dashBoardName = dashboard.name;
            $scope.dashboardItems = dashboard.dashboardItems;
           angular.forEach($scope.dashboardItems,function(value){
                value.name = $scope.getDashboardName(value);
                value.column_size = $scope.getColumnSize(value.shape);
                $scope.getAnalytics(value, 608, false )

                value.labelCard=$scope.getCardSize(value.shape);
            });

            $scope.loading=false;
        });
        //$scope.column_size

        $scope.getColumnSize = function(sizeName){
            var size=12;//Default size
            if(angular.lowercase(sizeName)=="double_width") {
                size=6;
            }else if(angular.lowercase(sizeName)=="full_width"){
                size=12;
            }else if(angular.lowercase(sizeName)=="normal") {
                size=6;
            }
            return 'col-md-'+size;
        };

        $scope.cardClassResizable=function(dashboardItem){
            if(dashboardItem.column_size == 'col-md-6'){
                dashboardItem.column_size = 'col-md-12';
            }else if(dashboardItem.column_size == 'col-md-12'){
                dashboardItem.column_size = 'col-md-6';
            }

            if(dashboardItem.type=='CHART'){
                //var dItem = $scope.dashboardChart[dashboardItem.id];
                //$scope.dashboardChart[dashboardItem.id] = null;
                //$scope.dashboardChart[dashboardItem.id] = dItem
                //$scope.$broadcast('highchartsng.reflow');
            }

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
         };

        $scope.getDashboardItem = function(dashboardItem) {
            return dashboardItem[dashboardItem.type];
        };

        $scope.getAnalytics = function( dashboardItem, width, prepend )
        {
            width = width || 408;
            prepend = prepend || false;

            var graphStyle = "width:" + width + "px; overflow:hidden;";
            var tableStyle = "width:" + width + "px;";
            var userOrgUnit =  [];
            $scope.dashboardLoader[dashboardItem.id] = true;

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
                    dashboardItem.object=window.object;
                    dashboardItem.analyticsUrl = window.alayticsUrl;
                    var analytics = dashboardItem.analyticsUrl;
                    $http.get('../../../'+dashboardItem.analyticsUrl)
                        .success(function(analyticsData){
                            $scope.dashboardAnalytics[dashboardItem.id] = analyticsData;
                            $scope.dashboardDataElements[dashboardItem.id] = chartsManager.getMetadataArray(analyticsData,'dx');
                            var chartType=dashboardItem.object.type.toLowerCase();
                            $scope.dashboardChartType[dashboardItem.id] = chartType;
                            dashboardItem.chartXAxis = dashboardItem.object.category;
                            dashboardItem.chartYAxis = dashboardItem.object.series;
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart(analyticsData,dashboardItem.object.category,[],dashboardItem.object.series,[],'none','',dashboardItem.object.name,chartType);
                            $scope.dashboardLoader[dashboardItem.id] = false;
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

                        // get user orgunits and childrens
                        mapManager.getUserOrgunit().then(function (response) {
                            var userOrgUnit = response.data[0].children;

                            mapManager.prepareMapLayers(mapViews,userOrgUnit).then(function(thematicLayer,boundaryLayer){
                                var boundary = [];



                                boundaryLayer.success(function(boundaryData){


                                    dashboardItem.map = {};
                                    var latitude = output.latitude/100000;
                                    var longitude = output.longitude/100000;
                                    var zoom = output.zoom-1;

                                    // process thematic layers
                                    thematicLayer.success(function(thematicData){

                                        boundary = mapManager.getGeoJson(boundaryData,thematicData,layerProperties,{latitude:latitude,longitude:longitude,zoom:zoom});
                                        angular.extend(dashboardItem.map,boundary);

                                        olData.getMap().then(function(map) {
                                            var previousFeature;
                                            var overlay = new ol.Overlay({
                                                element: document.getElementById('districtbox'),
                                                positioning: 'top-right',
                                                offset: [100, -100],
                                                position: [100, -100]
                                            });
                                            var overlayHidden = true;
                                            // Mouse click function, called from the Leaflet Map Events
                                            $scope.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {
                                                //$scope.$apply(function(scope) {
                                                //
                                                //    scope.selectedDistrictHover = feature ? $scope.districts[feature.getId()] : '';
                                                //    if(feature) {
                                                //        scope.selectedDistrictHover = feature ? $scope.districts[feature.getId()] : '';
                                                //    }
                                                //
                                                //});
                                                //
                                                //if (!feature) {
                                                //    map.removeOverlay(overlay);
                                                //    overlayHidden = true;
                                                //    return;
                                                //} else if (overlayHidden) {
                                                //    map.addOverlay(overlay);
                                                //    overlayHidden = false;
                                                //}
                                                //overlay.setPosition(map.getEventCoordinate(olEvent));
                                                //if (feature) {
                                                //    feature.setStyle(olHelpers.createStyle({
                                                //        fill: {
                                                //            color: mapManager.getColor(mapManager.features[feature.getId()])
                                                //        },
                                                //        stroke: {
                                                //            color: '#A3CEC5',
                                                //            width:2
                                                //
                                                //        }
                                                //    }));
                                                //    if (previousFeature && feature !== previousFeature) {
                                                //        previousFeature.setStyle(mapManager.getStyle(previousFeature));
                                                //    }
                                                //    previousFeature = feature;
                                                //}
                                            });

                                            $scope.$on('openlayers.layers.geojson.click', function(event, feature, olEvent) {
                                                //$scope.$parent.main.chart_shown = false;
                                                //$scope.$parent.main.backToGrid()
                                                ////$scope.closeTootipHover();
                                                //$scope.$apply(function(scope) {
                                                //    scope.selectedDistrict = feature ? $scope.districts[feature.getId()] : '';
                                                //    $scope.$parent.main.org_unit_selected = scope.selectedDistrict.district_id;
                                                //    if(feature) {
                                                //        // looping throught indicator types
                                                //        scope.selectedDistrict = feature ? $scope.districts[feature.getId()] : '';
                                                //        $scope.selectedDistrictName = scope.selectedDistrict.name;
                                                //        var orgUnit = {children:null};
                                                //        $scope.$parent.main.processView(orgUnit,scope.selectedDistrict.name,scope.selectedDistrict.district_id)
                                                //
                                                //
                                                //    }
                                                //});
                                                //
                                                //if (!feature) {
                                                //    map.removeOverlay(overlay);
                                                //    overlayHidden = true;
                                                //    return;
                                                //} else if (overlayHidden) {
                                                //    map.addOverlay(overlay);
                                                //    overlayHidden = false;
                                                //}
                                                //overlay.setPosition(map.getEventCoordinate(olEvent));
                                                //if (feature) {
                                                //    feature.setStyle(olHelpers.createStyle({
                                                //        fill: {
                                                //            color: '#FFF'
                                                //        }
                                                //    }));
                                                //    if (previousFeature && feature !== previousFeature) {
                                                //        previousFeature.setStyle(getStyle(previousFeature));
                                                //    }
                                                //    previousFeature = feature;
                                                //}
                                            });
                                            //$scope.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {
                                            //    $scope.$apply(function(scope) {
                                            //        if(feature) {
                                            //            $scope.id = feature.getId();
                                            //            scope.selectedDistrict = feature ? mapManager.features[feature.getId()]: '';
                                            //        }
                                            //    });
                                            //
                                            //});
                                        });

                                    });
                                })

                                thematicLayer.error(function(response){
                                    //console.log(response);
                                });

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
                    $scope.dashboardItem = dashboardItem.tableName;
                    var column = {};
                    var rows = {};
                    var filters = {};
                    var analytics = dashboardItem.analyticsUrl;
                    $http.get('../../..'+dashboardItem.analyticsUrl)
                            .success(function(analyticsData){
                            $scope.dashboardDataElements[dashboardItem.id] = chartsManager.getMetadataArray(analyticsData,'dx');
                            $scope.dashboardLoader[dashboardItem.id] = false;
                            $scope.dashboardAnalytics[dashboardItem.id] = analyticsData;
                            $scope.dimensions = {
                                selected: null,
                                axises: {"xAxis": [], "yAxis": []}
                            };
                            angular.forEach(dashboardItem.object.rows,function(row){
                                rows['rows']=row.dimension;
                                $scope.dimensions.axises.xAxis.push({label:row.dimension});
                            });
                            angular.forEach(dashboardItem.object.columns, function (col) {
                                column['column'] = col.dimension;
                                $scope.dimensions.axises.yAxis.push({label:col.dimension});
                            });
                            angular.forEach(dashboardItem.object.filters,function(filter){
                                filters['filters']=filter.dimension;
                            });
                            $scope.$watch('dimensions', function(dimension) {
                                $scope.dimensionAsJson = angular.toJson(dimension, true);
                            }, true);
                            console.log($scope.dimensions.axises)
                            dashboardItem.columnLength=$scope.dimensions.axises.yAxis.length
                            dashboardItem.rowLenth=$scope.dimensions.axises.xAxis.length
                            dashboardItem.chartXAxis = rows.rows;
                            dashboardItem.chartYAxis = column.column;
                            $scope.dashboardChartType[dashboardItem.id] = 'bar';
                            if (dashboardItem.object.columns.length == 2){
                                dashboardItem
                                $scope.tableDimension[dashboardItem.id]='2';
                                var firstDimension=dashboardItem.object.columns[0].dimension;
                                var secondDimension=dashboardItem.object.columns[1].dimension;
                                $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,firstDimension,secondDimension);
                                $scope.secondColumn[dashboardItem.id]=TableRenderer.drawTableWithTwoHeader(analyticsData,firstDimension,secondDimension);
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension(analyticsData,rows.rows,firstDimension,secondDimension);
                            }else if(dashboardItem.object.rows.length == 2){
                                $scope.tableDimension[dashboardItem.id]='3';
                                var firstRow=dashboardItem.object.rows[0].dimension;
                                var secondRow=dashboardItem.object.rows[1].dimension;
                                $scope.column[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,column.column," ");
                                $scope.firstRow[dashboardItem.id]=TableRenderer.drawTableWithSingleRowDimension(analyticsData,firstRow,secondRow);
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension(analyticsData,firstRow,column.column,secondRow);
                            }else{
                                $scope.tableDimension[dashboardItem.id]='1';
                                $scope.headers[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,column.column," ");
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw(analyticsData,rows.rows,column.column);
                            }
                    });
                });
            }
        }

        //update the dashboard acording to the filters
        $scope.updateDashboard = function(){
            angular.forEach($scope.dashboardItems,function(value){
                console.log($scope.dashboardDataElements[value.id]);
                $scope.dashboardLoader[value.id] = true;
                var analyticsUrl = filtersManager.getAnalyticsLink($scope.data.outOrganisationUnits,$scope.data.outOrPeriods,$scope.dashboardDataElements[value.id]);
                $http.get(analyticsUrl)
                    .success(function(analyticsData){
                        $scope.dashboardAnalytics[value.id] = analyticsData;
                        if(value.type == 'CHART'){
                            $scope.dashboardChart[value.id] = chartsManager.drawChart(analyticsData,value.chartXAxis,[],value.chartYAxis,[],'none','',value.object.name,$scope.dashboardChartType[value.id])
                            $scope.dashboardLoader[value.id] = false;
                        }else if(value.type == 'MAP'){
                            //mpande
                        }else if(value.type == 'REPORT_TABLE'){
                            var columns = {};
                            var rows = {};
                            var filters = {};
                            $scope.dimensions = {
                                selected: null,
                                axises: {"xAxis": [], "yAxis": []}
                            };
                            angular.forEach(value.object.rows,function(row){
                                rows['rows']=row.dimension;
                                $scope.dimensions.axises.xAxis.push({label:row.dimension});
                            });
                            angular.forEach(value.object.columns, function (col) {
                                columns['column'] = col.dimension;
                                $scope.dimensions.axises.yAxis.push({label:col.dimension});
                            });
                            angular.forEach(value.object.filters,function(filter){
                                filters['filters']=filter.dimension;
                            });
                            $scope.$watch('dimensions', function(dimension) {
                                $scope.dimensionAsJson = angular.toJson(dimension, true);
                            }, true);
                            value.columnLength=$scope.dimensions.axises.yAxis.length
                            value.rowLenth=$scope.dimensions.axises.xAxis.length
                            console.log($scope.dimensions.axises)
                            if (value.object.columns.length == 2){
                                $scope.tableDimension[value.id]='2';
                                var firstDimension=value.object.columns[0].dimension;
                                var secondDimension=value.object.columns[1].dimension;
                                $scope.firstColumn[value.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,firstDimension,secondDimension);
                                $scope.secondColumn[value.id]=TableRenderer.drawTableWithTwoHeader(analyticsData,firstDimension,secondDimension);
                                $scope.dashboardTab[value.id]=TableRenderer.drawTableWithTwoRowDimension(analyticsData,rows.row,firstDimension,secondDimension);
                            }else if(value.object.rows.length == 2){
                                $scope.tableDimension[value.id]='3';
                                var firstRow=value.object.rows[0].dimension;
                                var secondRow=value.object.rows[1].dimension;
                                $scope.column[value.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,columns.column," ");
                                $scope.firstRow[value.id]=TableRenderer.drawTableWithSingleRowDimension(analyticsData,firstRow,secondRow);
                                $scope.dashboardTab[value.id]=TableRenderer.drawTableWithTwoColumnDimension(analyticsData,firstRow,columns.column,secondRow);
                            }else{
                                $scope.tableDimension[value.id]='1';
                                $scope.headers[value.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,columns.column," ");
                                $scope.dashboardTab[value.id]=TableRenderer.getMetadataItemsTableDraw(analyticsData,rows.row,columns.column);
                            }
                            $scope.dashboardLoader[value.id] = false;
                        }

                    });

            });

        }

        //update the dashboard according to the filters
        $scope.updateSingleDashboard = function(dashboardItem,chartType){
           $scope.dashboardChartType[dashboardItem.id] = chartType;
            var analyticsUrl = filtersManager.getAnalyticsLink($scope.data.outOrganisationUnits,$scope.data.outOrPeriods,$scope.dashboardDataElements[dashboardItem.id]);
            if( chartType == 'table') {
                dashboardItem.type='REPORT_TABLE';
                var columns = {};
                var rows = {};
                var filters = {};
                $scope.dimensions = {
                    selected: null,
                    axises: {"xAxis": [], "yAxis": []}
                };
                angular.forEach(dashboardItem.object.rows,function(row){
                    rows['rows']=row.dimension;
                    $scope.dimensions.axises.xAxis.push({label:row.dimension});
                });
                angular.forEach(dashboardItem.object.columns, function (col) {
                    columns['column'] = col.dimension;
                    $scope.dimensions.axises.yAxis.push({label:col.dimension});
                });
                angular.forEach(dashboardItem.object.filters,function(filter){
                    filters['filters']=filter.dimension;
                });
                 $scope.$watch('dimensions', function(dimension) {
                    $scope.dimensionAsJson = angular.toJson(dimension, true);
                }, true);
                dashboardItem.columnLength=$scope.dimensions.axises.yAxis.length
                dashboardItem.rowLenth=$scope.dimensions.axises.xAxis.length
                console.log($scope.dimensions.axises)
                if (dashboardItem.object.columns.length == 2){
                    $scope.tableDimension[dashboardItem.id]='2';
                    var firstDimension=dashboardItem.object.columns[0].dimension;
                    var secondDimension=dashboardItem.object.columns[1].dimension;
                    $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],firstDimension,secondDimension);
                    $scope.secondColumn[dashboardItem.id]=TableRenderer.drawTableWithTwoHeader($scope.dashboardAnalytics[dashboardItem.id],firstDimension,secondDimension);
                    $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension($scope.dashboardAnalytics[dashboardItem.id],rows.rows,firstDimension,secondDimension);
                }else if(dashboardItem.object.rows.length == 2){
                    $scope.tableDimension[dashboardItem.id]='3';
                    var firstRow=dashboardItem.object.rows[0].dimension;
                    var secondRow=dashboardItem.object.rows[1].dimension;
                    $scope.column[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],columns.column," ");
                    $scope.firstRow[dashboardItem.id]=TableRenderer.drawTableWithSingleRowDimension($scope.dashboardAnalytics[dashboardItem.id],firstRow,secondRow);
                    $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension($scope.dashboardAnalytics[dashboardItem.id],firstRow,columns.column,secondRow);
                }else{
                    $scope.tableDimension[dashboardItem.id]='1';
                    $scope.headers[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],columns.column," ");
                    $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw($scope.dashboardAnalytics[dashboardItem.id],rows.rows,columns.column);
                }
            }
            else if(chartType == 'map') {

            }else{
                dashboardItem.type='CHART';
                $scope.dashboardLoader[dashboardItem.id] = true;
                $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis,[],dashboardItem.chartYAxis,[],'none','',dashboardItem.object.name,chartType)
                $scope.dashboardLoader[dashboardItem.id] = false;
            }

        }

        //update the dashboard charts according to layout selection
        $scope.updateChartLayout = function(dashboardItem,chartType,xAxis,yAxis) {
            $scope.dashboardLoader[dashboardItem.id] = true;
            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id], xAxis, [], yAxis, [], 'none', '', dashboardItem.object.name, chartType)
            $scope.dashboardLoader[dashboardItem.id] = false;
        }
        $scope.updateTableLayout=function(dashboardItem,columns,rows){
            console.log(columns);
            console.info(rows);
              dashboardItem.columnLength=columns.length
              dashboardItem.rowLenth=rows.length
            if (columns.length == 2){
                $scope.tableDimension[dashboardItem.id]=dashboardItem.columnLength;
                var firstDimension=columns[0].label;
                var secondDimension=columns[1].label;
                var rows=rows[0].label;
                $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],firstDimension,secondDimension);
                $scope.secondColumn[dashboardItem.id]=TableRenderer.drawTableWithTwoHeader($scope.dashboardAnalytics[dashboardItem.id],firstDimension,secondDimension);
                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension($scope.dashboardAnalytics[dashboardItem.id],rows,firstDimension,secondDimension);
            }else if(rows.length == 2){
                $scope.tableDimension[dashboardItem.id]='3';
                var firstRow=rows[0].label;
                var secondRow=rows[1].label;
                var columns=columns[0].label;
                $scope.column[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],columns," ");
                $scope.firstRow[dashboardItem.id]=TableRenderer.drawTableWithSingleRowDimension($scope.dashboardAnalytics[dashboardItem.id],firstRow,secondRow);
                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension($scope.dashboardAnalytics[dashboardItem.id],firstRow,columns,secondRow);
            }else{
                $scope.tableDimension[dashboardItem.id]='1';
                $scope.headers[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],columns[0].label," ");
                $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw($scope.dashboardAnalytics[dashboardItem.id],rows[0].label,columns[0].label);
            }
        }

        //prepare data for use in csv
        $scope.prepareDataForCSV = function(dashboardItem){
            var chartObject = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis,[],dashboardItem.chartYAxis,[],'none','',dashboardItem.object.name,'bar')
            var items = [];
            angular.forEach(chartObject.series,function(value){
                var obj = {name:value.name};
                var i = 0;
                angular.forEach(chartObject.xAxis.categories,function(val){
                    obj[val] = value.data[i];
                    i++;
                })
                items.push(obj);
            })
            return items;
        };
    }]);

    //directive to display the tabs
    dashboardController.directive('tabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: [ "$scope", function($scope) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                }

                this.addPane = function(pane) {
                    if (panes.length == 0) $scope.select(pane);
                    panes.push(pane);
                }
            }],
            template:
            '<div class="tabbable">' +
            '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
            '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
            '</ul>' +
            '<div class="tab-content" ng-transclude></div>' +
            '</div>',
            replace: true
        };
    })
        dashboardController.directive('pane', function() {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: { title: '@' },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
            replace: true
        };
    })
