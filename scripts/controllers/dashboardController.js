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
        $scope.icons = [
            {name: 'table', image: 'table.jpg', action: ''},
            {name: 'bar', image: 'bar.png', action: ''},
            {name: 'line', image: 'line.png', action: ''},
            {name: 'combined', image: 'combined.jpg', action: ''},
            {name: 'column', image: 'column.png', action: ''},
            {name: 'area', image: 'area.jpg', action: ''},
            {name: 'pie', image: 'pie.png', action: ''},
            {name: 'map', image: 'map.jpg', action: ''}
        ];

        var d = new Date();
        //default filter values
        $scope.yearValue = d.getFullYear();
        $scope.periodType = "Monthly";
        $scope.radioValue = 'all';
        $scope.tableColumn = 'ou';
        $scope.tableRow = 'dx';
        $scope.chartXAxis = 'ou';
        $scope.chartYAxis = 'dx';

        /**
         *
         * Filters Specification
         */
        $scope.data = [];
        $scope.updateTree = function(orgUnitArray){
            $scope.data.orgUnitTree = [];
            angular.forEach(orgUnitArray.organisationUnits,function(value){
                var zoneRegions = [];
                angular.forEach(value.children,function(regions){
                    var regionDistricts = [];
                    angular.forEach(regions.children,function(district){
                        var districtsFacility = [];
                        angular.forEach(district.children,function(facility){
                            districtsFacility.push({name:facility.name,id:facility.id });
                        });
                        regionDistricts.push({name:district.name,id:district.id, children:districtsFacility });
                    });
                    zoneRegions.push({ name:regions.name,id:regions.id, children:regionDistricts });
                });
                $scope.data.orgUnitTree.push({ name:value.name,id:value.id, children:zoneRegions,selected:true });
            });
            return $scope.data.orgUnitTree
        };

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
        //Orgunits
        $http.get("../../../api/organisationUnits.json?filter=level:eq:1&paging=false&fields=id,name,children[id,name,children[id,name,children[id,name]]]")
            .success(function(orgUnits){
                console.info($scope.updateTree(orgUnits))
            });

        $scope.changePeriodType = function(type){
            console.log(type)
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

            $modal.open({
                animation: true,
                templateUrl: 'views/dashboardModel.html',
                scope: $scope,
                controller: 'ModalInstanceCtrl',
                size: "lg"
            });
        };


        $scope.getPeriodArray = function(type){
            var year = $scope.yearValue;
            var periods = [];
            if(type == "Weekly"){
                periods.push({id:'',name:''})
            }if(type == "Monthly"){
                periods.push({id:year+'01',name:'January '+year},{id:year+'02',name:'February '+year},{id:year+'03',name:'March '+year},{id:year+'04',name:'April '+year},{id:year+'05',name:'May '+year},{id:year+'06',name:'June '+year},{id:year+'07',name:'July '+year},{id:year+'08',name:'August '+year},{id:year+'09',name:'September '+year},{id:year+'10',name:'October '+year},{id:year+'11',name:'November '+year},{id:year+'12',name:'December '+year})
            }if(type == "BiMonthly"){
                periods.push({id:year+'01B',name:'January - February '+year},{id:year+'02B',name:'March - April '+year},{id:year+'03B',name:'May - June '+year},{id:year+'04B',name:'July - August '+year},{id:year+'05B',name:'September - October '+year},{id:year+'06B',name:'November - December '+year})
            }if(type == "Quarterly"){
                periods.push({id:year+'Q1',name:'January - March '+year},{id:year+'Q2',name:'April - June '+year},{id:year+'Q3',name:'July - September '+year},{id:year+'Q4',name:'October - December '+year})
            }if(type == "SixMonthly"){
                periods.push({id:year+'S1',name:'January - June '+year},{id:year+'S2',name:'July - December '+year})
            }if(type == "SixMonthlyApril"){
                periods.push({id:year+'AprilS2',name:'October 2011 - March 2012'},{id:year+'AprilS1',name:'April - September '+year})
            }if(type == "FinancialOct"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt($scope.yearValue) - i;
                    periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+useYear})
                }
            }if(type == "Yearly"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt($scope.yearValue) - i;
                    periods.push({id:useYear,name:useYear})
                }
            }if(type == "FinancialJuly"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt($scope.yearValue) - i;
                    periods.push({id:useYear+'July',name:'July '+useYear+' - June '+useYear})
                }
            }if(type == "FinancialApril"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt($scope.yearValue) - i;
                    periods.push({id:useYear+'April',name:'April '+useYear+' - March '+useYear})
                }
            }
            $scope.periods = periods;
        };

        $scope.getPeriodArray($scope.periodType);

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
            })

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
                    dashboardItem.object=window.object;
                    dashboardItem.analyticsUrl = window.alayticsUrl;
                    $http.get('../../../'+dashboardItem.analyticsUrl)
                        .success(function(analyticsData){
                            var chartType=(dashboardItem.object.type).toLowerCase();
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawOtherCharts(analyticsData,dashboardItem.object.category,[],dashboardItem.object.series,[],'none','',dashboardItem.object.name,chartType);
                            $scope.dashboardChart[dashboardItem.id].loading = false;
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
dashboardController.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

                $scope.items = items;
                $scope.selected = {
                    item: $scope.items[0]
                };

                $scope.ok = function () {
                    $uibModalInstance.close($scope.selected.item);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });
