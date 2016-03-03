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
        //placeholder for card chart
        $scope.dashboardChart = [];
        //placaholder for dashboard dataElement
        $scope.dashboardDataElements = [];
        //placeholder for the analytics object to prevent multiple loading
        $scope.dashboardAnalytics = [];
        //placeholder for loading status of dashoard[TRUE,FALSE]
        $scope.dashboardLoader = [];
        //placeholder for failed loading of dashboard loading status of dashoard[TRUE,FALSE]
        $scope.dashboardFailLoad = [];
        //placeholder to cary the type of chart for specific dashboard[bar,column,pie,line,area,stacked,spider,map]
        $scope.dashboardChartType = [];
        //placeholder to specify if type of chart is not supported by angular chart plugin
        $scope.showOtherCharts = [];
        $scope.dashboardTab = [];
        $scope.headers = [];
        $scope.firstColumn = [];
        $scope.secondColumn = [];
        $scope.tableDimension = [];
        $scope.tableRowDimension = [];
        $scope.tableOneDimensionBoth = [];
        $scope.icons = filtersManager.icons;
        $scope.multiPeriod = true;

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

        //$scope.$watch('data.outOrganisationUnits', function() {
        //    if($scope.data.outOrganisationUnits){
        //        if($scope.data.outOrganisationUnits.length > 1){
        //            $scope.updateMethod();
        //        }else{
        //
        //        }
        //    }
        //
        //}, true);


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
            if(type.indexOf("Relative") > -1){
                $scope.multiPeriod = false;
            }else{
                $scope.multiPeriod = true;
            }
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
                $scope.dashboardChart[dashboardItem.id].chart.events.load();
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
                    $http.get('../../../'+dashboardItem.analyticsUrl)
                        .success(function(analyticsData){
                            $scope.dashboardAnalytics[dashboardItem.id] = analyticsData;
                            $scope.dashboardDataElements[dashboardItem.id] = chartsManager.getMetadataArray(analyticsData,'dx');
                            var chartType=dashboardItem.object.type.toLowerCase();
                            //setting chart service
                            $scope.dashboardChartType[dashboardItem.id] = chartType;
                            dashboardItem.chartXAxis = dashboardItem.object.category;
                            dashboardItem.chartYAxis = dashboardItem.object.series;
                            dashboardItem.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.object.category);
                            dashboardItem.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.object.series);
                            dashboardItem.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.object.series);
                            dashboardItem.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.object.category);
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart(analyticsData,dashboardItem.object.category,[],dashboardItem.object.series,[],'none','',dashboardItem.object.name,chartType);
                            $scope.dashboardLoader[dashboardItem.id] = false;
                            $scope.dashboardFailLoad[dashboardItem.id] = false;
                        }).error(function(error){
                            $scope.dashboardLoader[dashboardItem.id] = false;
                            $scope.dashboardFailLoad[dashboardItem.id] = true;
                        });
                },function(){
                    $scope.dashboardLoader[dashboardItem.id] = false;
                    $scope.dashboardFailLoad[dashboardItem.id] = true;
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
                                    $scope.dashboardLoader[dashboardItem.id] = false;
                                    $scope.dashboardFailLoad[dashboardItem.id] = true;
                                });

                            thematicLayer.error(function(response){
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                            });

                            boundaryLayer.error(function(response){
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                            });


                            });
                        }, function (error) {
                            $scope.dashboardLoader[dashboardItem.id] = false;
                            $scope.dashboardFailLoad[dashboardItem.id] = true;
                        });



                    },function(){
                            $scope.dashboardLoader[dashboardItem.id] = false;
                            $scope.dashboardFailLoad[dashboardItem.id] = true;
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
                                    axises: {"xAxis": [], "yAxis": [],"filter":[]}
                                };
                                angular.forEach(dashboardItem.object.rows,function(row){
                                    rows['rows']=row.dimension;
                                    $scope.dimensions.axises.xAxis.push({label:row.dimension,name:analyticsData.metaData.names[row.dimension]});
                                });
                                angular.forEach(dashboardItem.object.columns, function (col) {
                                    column['column'] = col.dimension;
                                    $scope.dimensions.axises.yAxis.push({label:col.dimension,name:analyticsData.metaData.names[col.dimension]});
                                });
                                angular.forEach(dashboardItem.object.filters,function(filter){
                                    filters['filters']=filter.dimension;
                                    $scope.dimensions.axises.filter.push({label:filter.dimension,name:analyticsData.metaData.names[filter.dimension]});
                                });
                                $scope.$watch('dimensions', function(dimension) {
                                    $scope.dimensionAsJson = angular.toJson(dimension, true);
                                }, true);
                                dashboardItem.columnLength=$scope.dimensions.axises.yAxis.length
                                dashboardItem.rowLenth=$scope.dimensions.axises.xAxis.length
                                dashboardItem.chartXAxis = rows.rows;
                                dashboardItem.chartYAxis = column.column;
                                dashboardItem.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],rows.rows);
                                dashboardItem.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],column.column);
                                dashboardItem.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],column.column);
                                dashboardItem.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],rows.rows);


                            $scope.dashboardChartType[dashboardItem.id] = 'bar';
                                if (dashboardItem.object.columns.length == 2){
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
                            }).error(function(error){
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                            });
                },function(){
                    $scope.dashboardLoader[dashboardItem.id] = false;
                    $scope.dashboardFailLoad[dashboardItem.id] = true;
                });
            }
        }

        //update the dashboard acording to the filters
        $scope.updateDashboard = function(){
            angular.forEach($scope.dashboardItems,function(value){
                $scope.dashboardLoader[value.id] = true;
                value.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[value.id],value.chartXAxis);
                value.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[value.id],value.chartYAxis);
                value.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[value.id],value.chartYAxis);
                value.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[value.id],value.chartXAxis);

                var analyticsUrl = filtersManager.getAnalyticsLink($scope.data.outOrganisationUnits,$scope.data.outOrPeriods,$scope.dashboardDataElements[value.id]);
                $http.get(analyticsUrl)
                    .success(function(analyticsData){
                        $scope.dashboardLoader[value.id] = false;
                        $scope.dashboardFailLoad[value.id] = false;
                        $scope.dashboardAnalytics[value.id] = analyticsData;
                        if(value.type == 'CHART'){
                            $scope.dashboardChart[value.id] = chartsManager.drawChart(analyticsData,value.chartXAxis,[],value.chartYAxis,[],'none','',value.object.name,$scope.dashboardChartType[value.id])

                        }else if(value.type == 'MAP'){
                            //mpande
                        }else if(value.type == 'REPORT_TABLE'){
                            var columns = {};
                            var rows = {};
                            var filters = {};
                            $scope.dimensions = {
                                selected: null,
                                axises: {"xAxis": [], "yAxis": [],"filter":[]}
                            };
                            angular.forEach(value.object.rows,function(row){
                                rows['rows']=row.dimension;
                                $scope.dimensions.axises.xAxis.push({label:row.dimension,name:analyticsData.metaData.names[row.dimension]});
                            });
                            angular.forEach(value.object.columns, function (col) {
                                columns['column'] = col.dimension;
                                $scope.dimensions.axises.yAxis.push({label:col.dimension,name:analyticsData.metaData.names[col.dimension]});
                            });
                            angular.forEach(value.object.filters,function(filter){
                                filters['filters']=filter.dimension;
                                $scope.dimensions.axises.filter.push({label:filter.dimension,name:analyticsData.metaData.names[filter.dimension]});
                            });

                            $scope.$watch('dimensions', function(dimension) {
                                $scope.dimensionAsJson = angular.toJson(dimension, true);
                            }, true);
                            value.columnLength=$scope.dimensions.axises.yAxis.length
                            value.rowLenth=$scope.dimensions.axises.xAxis.length
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
                        }

                    }).error(function(error){
                        $scope.dashboardLoader[value.id] = false;
                        $scope.dashboardFailLoad[value.id] = true;
                    });

            });

        };



        //update the dashboard according to the filters
        $scope.updateSingleDashboard = function(dashboardItem,chartType){
           $scope.dashboardChartType[dashboardItem.id] = chartType;
            if( chartType == 'table') {
                dashboardItem.type='REPORT_TABLE';
                var columns = {};
                var rows = {};
                var filters = {};
                $scope.dimensions = {
                    selected: null,
                    axises: {"xAxis": [], "yAxis": [],"filter":[]}
                };
                angular.forEach(dashboardItem.object.rows,function(row){
                    rows['rows']=row.dimension;
                    $scope.dimensions.axises.xAxis.push({label:row.dimension,name:$scope.dashboardAnalytics[dashboardItem.id].metaData.names[row.dimension]});
                });
                angular.forEach(dashboardItem.object.columns, function (col) {
                    columns['column'] = col.dimension;
                    $scope.dimensions.axises.yAxis.push({label:col.dimension,name:$scope.dashboardAnalytics[dashboardItem.id].metaData.names[col.dimension]});
                });
                angular.forEach(dashboardItem.object.filters,function(filter){
                    filters['filters']=filter.dimension;
                    $scope.dimensions.axises.filter.push({label:filter.dimension,name:$scope.dashboardAnalytics[dashboardItem.id].metaData.names[filter.dimension]});
                });
                 $scope.$watch('dimensions', function(dimension) {
                    $scope.dimensionAsJson = angular.toJson(dimension, true);
                }, true);
                dashboardItem.columnLength=$scope.dimensions.axises.yAxis.length
                dashboardItem.rowLenth=$scope.dimensions.axises.xAxis.length
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
            dashboardItem.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],xAxis);
            dashboardItem.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],yAxis);
            dashboardItem.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],yAxis);
            dashboardItem.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],xAxis);
            $scope.dashboardLoader[dashboardItem.id] = true;
            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id], xAxis, [], yAxis, [], 'none', '', dashboardItem.object.name, chartType)
            $scope.dashboardLoader[dashboardItem.id] = false;
        }

        //update the dashboard charts according to layout selection
        $scope.updateChartDataSelection = function(dashboardItem,chartType,xAxis,yAxis,xAxisItems,yAxisItems) {
            var xItems = xAxisItems.map(function(a) {return a.id;});
            var yItems = yAxisItems.map(function(a) {return a.id;});
            $scope.dashboardLoader[dashboardItem.id] = true;
            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id], xAxis, xItems, yAxis, yItems, 'none', '', dashboardItem.object.name, chartType)
            $scope.dashboardLoader[dashboardItem.id] = false;
        }
        $scope.updateTableLayout=function(dashboardItem,columns,rows){
              dashboardItem.columnLength=columns.length
              dashboardItem.rowLenth=rows.length
            if (columns.length == 2 && rows.length==1){
                $scope.tableDimension[dashboardItem.id]=dashboardItem.columnLength;
                var firstDimension=columns[0].label;
                var secondDimension=columns[1].label;
                var rows=rows[0].label;
                $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],firstDimension,secondDimension);
                $scope.secondColumn[dashboardItem.id]=TableRenderer.drawTableWithTwoHeader($scope.dashboardAnalytics[dashboardItem.id],firstDimension,secondDimension);
                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension($scope.dashboardAnalytics[dashboardItem.id],rows,firstDimension,secondDimension);
            }else if(rows.length == 2 && columns.length==1){
                $scope.tableDimension[dashboardItem.id]='3';
                var firstRow=rows[0].label;
                var secondRow=rows[1].label;
                var columns=columns[0].label;
                $scope.column[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],columns," ");
                $scope.firstRow[dashboardItem.id]=TableRenderer.drawTableWithSingleRowDimension($scope.dashboardAnalytics[dashboardItem.id],firstRow,secondRow);
                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension($scope.dashboardAnalytics[dashboardItem.id],firstRow,columns,secondRow);
            }else if(rows.length == 1 && columns.length==1){
                $scope.tableDimension[dashboardItem.id]='1';
                $scope.headers[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],columns[0].label," ");
                $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw($scope.dashboardAnalytics[dashboardItem.id],rows[0].label,columns[0].label);
            }else{
                alert("Either of the dimensions must have valid dimension");
            }
        }

        //prepare data for use in csv
        $scope.prepareDataForCSV = function(dashboardItem){
            var chartObject = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis,[],dashboardItem.chartYAxis,[],'none','',dashboardItem.object.name,'bar')
            var items = [];
            angular.forEach(chartObject.series,function(value){
                var obj = {name:value.name};
                var i = 0;
                angular.forEach(chartObject.options.xAxis.categories,function(val){
                    obj[val] = value.data[i];
                    i++;
                })
                items.push(obj);
            })
            return items;
        };
    }]);

