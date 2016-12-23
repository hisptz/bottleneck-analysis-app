var dashboardController  = angular.module('dashboardController',[]);
dashboardController.controller('DashboardController',['$scope','$rootScope','$resource','dashboardsManager','dashboardItemsManager','userAccount',
    '$routeParams','$timeout','$translate','$window','$location','$alert','$modal','$route','Paginator','ContextMenuSelectedItem',
    '$filter','$http','CustomFormService','DHIS2URL', 'olHelpers',
    'olData','mapManager','chartsManager','TableRenderer','filtersManager','$localStorage','$sessionStorage','$q','MAP_TOKEN','leafletData',function(
                        $scope,
                        $rootScope,
                        $resource,
                        dashboardsManager,
                        dashboardItemsManager,
                        userAccount,
                        $routeParams,
                        $timeout,
                        $translate,
                        $window,
                        $location,
                        $alert,
                        $modal,
                        $route,
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
                        filtersManager,$localStorage,
                        $sessionStorage,
                        $q,
                        MAP_TOKEN,
                        leafletData

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
        $scope.dataElements=[];
        $scope.indicators=[];
        $scope.datasets=[];
        $scope.secondColumn = [];
        $scope.tableDimension = [];
        $scope.tableRowDimension = [];
        $scope.tableOneDimensionBoth = [];
        $scope.icons = filtersManager.icons;
        $scope.chartIcons = filtersManager.chartIcons;
        $scope.zoomIcons = filtersManager.zoomIcons;
        $scope.multiPeriod = true;

        /////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////
        //Drawing a sample map
        var data ={"headers":[{"name":"dx","column":"Data","type":"java.lang.String","hidden":false,"meta":true},{"name":"ou","column":"Organisation unit","type":"java.lang.String","hidden":false,"meta":true},{"name":"value","column":"Value","type":"java.lang.Double","hidden":false,"meta":false}],"metaData":{"names":{"2016":"2016","RD96nI1JXVV":"Kigoma Region","LGTVRhKSn1V":"Singida Region","EO3Ps3ny0Nr":"Shinyanga Region","MAL4cfZoFhJ":"Geita Region","A3b5mw8DJYC":"Mbeya Region","DWSo42hunXH":"Katavi Region","hAFRrgDK0fy":"Mwanza Region","dx":"Data","vAtZ8a924Lx":"Rukwa Region","Cpd5l15XxwA":"Dodoma Region","sWOWPBvwNY2":"Iringa Region","vYT08q7Wo33":"Mara Region","Crkg9BoUo5w":"Kagera Region","yyW17iCz9As":"Pwani Region","acZHYslyJLt":"Dar Es Salaam Region","qg5ySBw9X5l":"Manyara Region","UbnP1Kth7oJ":"ACT_<15 positivity rate","ou":"Organisation unit","bN5q5k5DgLA":"Mtwara Region","lnOyHhoLzre":"Kilimanjaro Region","kZ6RlMnt2bp":"Tabora Region","qarQhOt2OEh":"Njombe Region","Gk33rUTrPL5":"ACT_Testing by age categories","vU0Qt1A5IDz":"Tanga Region","m5WIYYiOtSp":"ACT_Number of children tested +VE (<15)","YtVMnut7Foe":"Arusha Region","VMgrQWSVIYn":"Lindi Region","Sj50oz9EHvD":"Morogoro Region","pe":"Period","IgTAEKMqKRe":"Simiyu Region","ZYYX8Q9SGoV":"Ruvuma Region"},"dx":["UbnP1Kth7oJ","m5WIYYiOtSp","Gk33rUTrPL5"],"pe":["2016"],"ou":["YtVMnut7Foe","acZHYslyJLt","Cpd5l15XxwA","MAL4cfZoFhJ","sWOWPBvwNY2","Crkg9BoUo5w","DWSo42hunXH","RD96nI1JXVV","lnOyHhoLzre","VMgrQWSVIYn","qg5ySBw9X5l","vYT08q7Wo33","A3b5mw8DJYC","Sj50oz9EHvD","bN5q5k5DgLA","hAFRrgDK0fy","qarQhOt2OEh","yyW17iCz9As","vAtZ8a924Lx","ZYYX8Q9SGoV","EO3Ps3ny0Nr","IgTAEKMqKRe","LGTVRhKSn1V","kZ6RlMnt2bp","vU0Qt1A5IDz"],"co":[]},"rows":[["UbnP1Kth7oJ","YtVMnut7Foe","1.4"],["UbnP1Kth7oJ","acZHYslyJLt","1.3"],["UbnP1Kth7oJ","Cpd5l15XxwA","5.5"],["UbnP1Kth7oJ","MAL4cfZoFhJ","2.1"],["UbnP1Kth7oJ","sWOWPBvwNY2","4.8"],["UbnP1Kth7oJ","Crkg9BoUo5w","1.2"],["UbnP1Kth7oJ","DWSo42hunXH","1.7"],["UbnP1Kth7oJ","RD96nI1JXVV","0.9"],["UbnP1Kth7oJ","lnOyHhoLzre","0.93"],["UbnP1Kth7oJ","VMgrQWSVIYn","0.38"],["UbnP1Kth7oJ","qg5ySBw9X5l","1.4"],["UbnP1Kth7oJ","vYT08q7Wo33","2.6"],["UbnP1Kth7oJ","A3b5mw8DJYC","5.9"],["UbnP1Kth7oJ","Sj50oz9EHvD","2.7"],["UbnP1Kth7oJ","bN5q5k5DgLA","1.6"],["UbnP1Kth7oJ","hAFRrgDK0fy","6.5"],["UbnP1Kth7oJ","qarQhOt2OEh","4.7"],["UbnP1Kth7oJ","yyW17iCz9As","1.2"],["UbnP1Kth7oJ","vAtZ8a924Lx","2.3"],["UbnP1Kth7oJ","ZYYX8Q9SGoV","4.3"],["UbnP1Kth7oJ","EO3Ps3ny0Nr","1.9"],["UbnP1Kth7oJ","IgTAEKMqKRe","2.5"],["UbnP1Kth7oJ","LGTVRhKSn1V","4.5"],["UbnP1Kth7oJ","kZ6RlMnt2bp","2.7"],["UbnP1Kth7oJ","vU0Qt1A5IDz","1.7"],["m5WIYYiOtSp","YtVMnut7Foe","24.0"],["m5WIYYiOtSp","acZHYslyJLt","120.0"],["m5WIYYiOtSp","Cpd5l15XxwA","10.0"],["m5WIYYiOtSp","MAL4cfZoFhJ","21.0"],["m5WIYYiOtSp","sWOWPBvwNY2","70.0"],["m5WIYYiOtSp","Crkg9BoUo5w","124.0"],["m5WIYYiOtSp","DWSo42hunXH","14.0"],["m5WIYYiOtSp","RD96nI1JXVV","11.0"],["m5WIYYiOtSp","lnOyHhoLzre","19.0"],["m5WIYYiOtSp","VMgrQWSVIYn","6.0"],["m5WIYYiOtSp","qg5ySBw9X5l","11.0"],["m5WIYYiOtSp","vYT08q7Wo33","21.0"],["m5WIYYiOtSp","A3b5mw8DJYC","80.0"],["m5WIYYiOtSp","Sj50oz9EHvD","31.0"],["m5WIYYiOtSp","bN5q5k5DgLA","39.0"],["m5WIYYiOtSp","hAFRrgDK0fy","59.0"],["m5WIYYiOtSp","qarQhOt2OEh","37.0"],["m5WIYYiOtSp","yyW17iCz9As","27.0"],["m5WIYYiOtSp","vAtZ8a924Lx","22.0"],["m5WIYYiOtSp","ZYYX8Q9SGoV","44.0"],["m5WIYYiOtSp","EO3Ps3ny0Nr","88.0"],["m5WIYYiOtSp","IgTAEKMqKRe","48.0"],["m5WIYYiOtSp","LGTVRhKSn1V","10.0"],["m5WIYYiOtSp","kZ6RlMnt2bp","92.0"],["m5WIYYiOtSp","vU0Qt1A5IDz","36.0"],["Gk33rUTrPL5","YtVMnut7Foe","12881.0"],["Gk33rUTrPL5","acZHYslyJLt","44632.0"],["Gk33rUTrPL5","Cpd5l15XxwA","3126.0"],["Gk33rUTrPL5","MAL4cfZoFhJ","3657.0"],["Gk33rUTrPL5","sWOWPBvwNY2","8828.0"],["Gk33rUTrPL5","Crkg9BoUo5w","33408.0"],["Gk33rUTrPL5","DWSo42hunXH","6775.0"],["Gk33rUTrPL5","RD96nI1JXVV","6201.0"],["Gk33rUTrPL5","lnOyHhoLzre","11767.0"],["Gk33rUTrPL5","VMgrQWSVIYn","7812.0"],["Gk33rUTrPL5","qg5ySBw9X5l","6149.0"],["Gk33rUTrPL5","vYT08q7Wo33","9385.0"],["Gk33rUTrPL5","A3b5mw8DJYC","14269.0"],["Gk33rUTrPL5","Sj50oz9EHvD","9923.0"],["Gk33rUTrPL5","bN5q5k5DgLA","10244.0"],["Gk33rUTrPL5","hAFRrgDK0fy","9755.0"],["Gk33rUTrPL5","qarQhOt2OEh","6381.0"],["Gk33rUTrPL5","yyW17iCz9As","10917.0"],["Gk33rUTrPL5","vAtZ8a924Lx","7785.0"],["Gk33rUTrPL5","ZYYX8Q9SGoV","5929.0"],["Gk33rUTrPL5","EO3Ps3ny0Nr","15289.0"],["Gk33rUTrPL5","IgTAEKMqKRe","9350.0"],["Gk33rUTrPL5","LGTVRhKSn1V","3953.0"],["Gk33rUTrPL5","kZ6RlMnt2bp","19904.0"],["Gk33rUTrPL5","vU0Qt1A5IDz","13142.0"]],"width":3,"height":75};
        chartsManager.getGeojson(data).then(function(result){
            console.log(JSON.stringify(result));
        });
        ////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////

        var d = new Date();
        //default filter values
        $scope.yearValue = d.getFullYear();
        $scope.periodType = "Yearly";
        $scope.radioValue = 'all';
        $scope.tableColumn = 'ou';
        $scope.tableRow = 'dx';
        $scope.chartXAxis = 'ou';
        $scope.chartYAxis = 'dx';

        //Update currently selected dashboard
        $scope.$storage = $localStorage;
        $http.get('../../../api/me/user-account.json').success(function(userAccount){
            $scope.currentUser=userAccount;
            $localStorage['dashboard.current.'+$scope.currentUser.username]=$routeParams.dashboardid;
            //console.log('SAVING A LANDING PAGE:'+'dashboard.current.'+$scope.currentUser.username);
        }).error(function(errorMessage){
            //Do nothing when ajax fails
            //console.log(errorMessage);
            //console.log('SHIT HAPPENED COULDNT SAVE LANDING PAGE');
        });

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
        filtersManager.getOrgUnitsLevels().then(function(data){
            $scope.data.orgUnitLevels = filtersManager.orderOrgUnitLevels(data.organisationUnitLevels);
         });
        filtersManager.getOrgUnitsGroups().then(function(data){
            $scope.data.orgUnitGroups = filtersManager.orderOrgUnitGroups(data.organisationUnitGroups);
         });
        $scope.linkValue = 'organisation';
        $scope.userOrgUnits=[];
        $scope.activateDropDown=function(linkValue){
            $scope.linkValue=linkValue;

        };
        $scope.changeOrgUnit=function(type,dashboardItem){
            $scope.linkValue=type;
            dashboardItem.orgUnitType=type;
        };
        $scope.userOrgUnits=[
            {name:'User org unit',value:'USER_ORGUNIT',padding:"10px"},
            {name:'User sub Units',value:'USER_ORGUNIT_CHILDREN',padding:0},
            {name:'User sub-x2-units',value:'USER_ORGUNIT_GRANDCHILDREN',padding:0}
        ];
        $scope.userOrgUnitsToCards=[
            {name:'User org unit',value:'USER_ORGUNIT',padding:"10px"},
            {name:'User sub Units',value:'USER_ORGUNIT_CHILDREN',padding:0},
            {name:'User sub-x2-units',value:'USER_ORGUNIT_GRANDCHILDREN',padding:0}
        ];
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
        $scope.hoverIn = function(){
            this.hoverEdit = true;
        };

        $scope.hoverOut = function(){
            this.hoverEdit = false;
        };
        $scope.mute = [];
        $scope.activateLink = function(linkValue){
            $scope.linkValue = linkValue;
            $scope.mute[linkValue] = !$scope.mute[linkValue];

         }
        $scope.mutes = [];
        $scope.activateLinkInd = function(linkValued){
            $scope.linkValued = linkValued;
            $scope.mutes[linkValued] = !$scope.mutes[linkValued];

         }


        $scope.changePeriodType = function(type,dashboardItem){

            if(dashboardItem){

                dashboardItem.periodType = type;
                if(type.indexOf("Relative") > -1){
                    dashboardItem.multiPeriod = false;
                }else{
                    dashboardItem.multiPeriod = true;
                }
                $scope.getPeriodArray(type,dashboardItem);
            }else{
                $scope.periodType = type;
                if(type.indexOf("Relative") > -1){
                    $scope.multiPeriod = false;
                }else{
                    $scope.multiPeriod = true;
                }
                $scope.getPeriodArray(type);
            }

        };

        //add year by one
        $scope.nextYear = function (dashboardItem) {
            if(dashboardItem){
                dashboardItem.yearValue = parseInt(dashboardItem.yearValue) + 1;
                $scope.getPeriodArray(dashboardItem.periodType);
            }else{
                $scope.yearValue = parseInt($scope.yearValue) + 1;
                $scope.getPeriodArray($scope.periodType);
            }

        }
        //reduce year by one
        $scope.previousYear = function (dashboardItem) {
            if(dashboardItem){
                dashboardItem.yearValue = parseInt(dashboardItem.yearValue) - 1;
                $scope.getPeriodArray(dashboardItem.periodType,dashboardItem);
            }else{
                $scope.yearValue = parseInt($scope.yearValue) - 1;
                $scope.getPeriodArray($scope.periodType);
            }
        }

        //popup model
        $scope.openModel = function (size) {
            $('#'+size).modal('show');
            $scope.$broadcast('highchartsng.reflow');
        };



        $scope.getPeriodArray = function(type,dashboardItem){
            if(dashboardItem){
                var year = dashboardItem.yearValue;
                dashboardItem.dataperiods = filtersManager.getPeriodArray(type,year);
            }else{
                var year = $scope.yearValue;
                $scope.periods = filtersManager.getPeriodArray(type,year);
            }

        };
        $scope.getPeriodArray($scope.periodType);

        //abstract dashboard name
        $scope.getDashboardName = function(dashboard){
            var name = "";
            if(dashboard.type == "REPORT_TABLE"){
                name = angular.isDefined(dashboard.reportTable.displayName) ? dashboard.reportTable.displayName : dashboard.reportTable.name;
            }if(dashboard.type == "CHART"){
                name = angular.isDefined(dashboard.chart.displayName) ? dashboard.chart.displayName : dashboard.chart.name;
            }if(dashboard.type == "MAP"){
                name = angular.isDefined(dashboard.map.displayName) ? dashboard.map.displayName : dashboard.map.name;
            }if(dashboard.type == "EVENT_REPORT"){
                name = angular.isDefined(dashboard.eventReport.displayName) ? dashboard.eventReport.displayName : dashboard.eventReport.name;
            }if(dashboard.type == "EVENT_CHART"){
                name = angular.isDefined(dashboard.eventChart.displayName) ? dashboard.eventChart.displayName : dashboard.eventChart.name;
            }
            return name;
        };

        //get dashboard interpretations
        $scope.getInterpretations = function(dashboard){
            var name = "";
            var deferred = $q.defer();
            if(dashboard.type == "REPORT_TABLE"){
                $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=reportTable.id:eq:' + dashboard.reportTable.id + '&paging=false')
                    .success(function(data){
                        $http.get('../../../api/reportTables/' + dashboard.reportTable.id +'/data.html').success(function(table){
                            data.image = table;
                            data.type = 'table';
                            data.id = dashboard.reportTable.id;
                            deferred.resolve(data);
                        });

                    })
                    .error(function(errorMessageData){
                        console.error(errorMessageData);
                        deferred.reject();
                    });
                return deferred.promise;
            }if(dashboard.type == "CHART"){
                $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=chart.id:eq:' + dashboard.chart.id + '&paging=false')
                    .success(function(data){
                        data.image = '../../../api/charts/' + dashboard.chart.id +'/data';
                        data.type = 'chart';
                        data.id = dashboard.chart.id;
                        deferred.resolve(data);
                    })
                    .error(function(errorMessageData){
                        console.error(errorMessageData);
                        deferred.reject();
                    });
                return deferred.promise;
            }if(dashboard.type == "MAP"){
                $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=map.id:eq:' + dashboard.map.id + '&paging=false')
                    .success(function(data){
                        data.image = '../../../api/maps/' + dashboard.map.id +'/data';
                        data.type = 'map';
                        data.id = dashboard.map.id;
                        deferred.resolve(data);
                    })
                    .error(function(errorMessageData){
                        console.error(errorMessageData);
                        deferred.reject();
                    });
                return deferred.promise;
            }if(dashboard.type == "EVENT_REPORT"){
                $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=reportTable.id:eq:' + dashboard.eventReport.id + '&paging=false')
                    .success(function(data){
                        $http.get('../../../api/reportTables/' + dashboard.eventReport.id +'/data.html').success(function(table){
                            data.image = table;
                            data.type = 'table';
                            data.id = dashboard.eventReport.id;
                            deferred.resolve(data);
                        });
                    })
                    .error(function(errorMessageData){
                        console.error(errorMessageData);
                        deferred.reject();
                    });
                return deferred.promise;
            }if(dashboard.type == "EVENT_CHART"){
                $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=chart.id:eq:' + dashboard.eventChart.id + '&paging=false')
                    .success(function(data){
                        data.image = '../../../api/charts/' + dashboard.eventChart.id +'/data';
                        data.type = 'chart';
                        data.id = dashboard.eventChart.id;
                        deferred.resolve(data);
                    })
                    .error(function(errorMessageData){
                        console.error(errorMessageData);
                        deferred.reject();
                    });
                return deferred.promise;
            }
            return name;
        };

        $scope.promises = [];

        $scope.column=[];
        $scope.firstRow=[];
        $scope.subRow=[];
        $scope.contains = function(searchText,needle) {
            if(searchText.indexOf(needle)!=-1) {
                return true;
            }else {
                return false
            }
        }
        dashboardsManager.getDashboard($routeParams.dashboardid).then(function(dashboard){
            $scope.dashBoardName = dashboard.name;
            $rootScope.dashName = dashboard.name;
            $scope.dashboardItems = dashboard.dashboardItems;
           angular.forEach($scope.dashboardItems,function(dashboardItem){
               //Set set currentVisualization
               if(dashboardItem.type=="CHART" || dashboardItem.type=="EVENT_CHART") {
                   dashboardItem.currentVisualization='chart.'+angular.lowercase(dashboardItem[$scope.formatEnumString(dashboardItem.type)].type);
               }else if(dashboardItem.type=="REPORT_TABLE" || dashboardItem.type=='EVENT_REPORT') {
                    dashboardItem.currentVisualization='table';
               }else if (dashboardItem.type=="MAP") {
                   dashboardItem.currentVisualization='map';
               }
               //Force normal size for Messages/Reports/Resources/Users
               if( dashboardItem.type=="MESSAGES"
                   || dashboardItem.type=="REPORTS"
                   || dashboardItem.type=="RESOURCES"
                   || dashboardItem.type=="USERS"
               ) {
                   dashboardItem.shape="NORMAL";
               }
               dashboardItem.yearValue = $scope.yearValue;
               dashboardItem.periodType = 'Yearly';
                $scope.getPeriodArray(dashboardItem.periodType,dashboardItem);
               dashboardItem.name = $scope.getDashboardName(dashboardItem);
               dashboardItem.column_size = $scope.getColumnSize(dashboardItem.shape);
                $scope.getAnalytics(dashboardItem, 608, false )

               dashboardItem.labelCard=$scope.getCardSize(dashboardItem.shape);
            });
            if(dashboard.dashboardItems.length==0){

                $scope.dashboardEmpty="DashboardItem is Empty,To populate dashboard items use the main dashboard."
                $scope.dashboardInstr="Enjoy interactive dashboard by switching,filtering and changing layout to different visualization charts and table as well as GIS"
            }

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

        $scope.cardClassResizable=function(dashboardItem){
            if(dashboardItem.column_size == 'col-md-8'){
                dashboardItem.column_size = 'col-md-12';
            }else if(dashboardItem.column_size == 'col-md-12'){
                dashboardItem.column_size = 'col-md-4';
            }else if(dashboardItem.column_size == 'col-md-4'){
                dashboardItem.column_size = 'col-md-8';
            }

            if(dashboardItem.type=='CHART'){
                var chartType = $scope.dashboardChartType[dashboardItem.id];
                (chartType == 'pie')?$scope.updateSingleDashboard(dashboardItem,'radar'):$scope.updateSingleDashboard(dashboardItem,'pie');
                $timeout(function() {
                    $scope.updateSingleDashboard(dashboardItem,chartType);

                },2 );

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

        $scope.formatEnumString = function(enumString){
            enumString = enumString.replace(/_/g,' ');
            enumString=enumString.toLowerCase();
            return enumString.substr(0,1)+enumString.replace(/(\b)([a-zA-Z])/g,
                function(firstLetter){
                    return   firstLetter.toUpperCase();
                }).replace(/ /g,'').substr(1);
        };

        function ucwords(str,force){
            str = str.replace(/\_/g,' ');
            str=force ? str.toLowerCase() : str;
            return str.replace(/(\b)([a-zA-Z])/g,
                function(firstLetter){
                    return   firstLetter.toUpperCase();
                });
        }

        //this is a very important function to get rid of chart.js
        $scope.prepareAnalytics  = function(dashboardItem){
            var url = ""; var column = ""; var row = ""; var filter = "";
            var i = 0;
            
            //Prepare dimension details (i.e. legendSet and metaData details for dynamic dimensions
            $scope.dimensionDetails={};
            $scope.dimensionDetails.metaData={};
            $scope.dimensionDetails.metaDataNames={};
            

            //Prepare legendSets for Dimensions
            $scope.dimensionDetails.legendSet={};
            //Go through all dataElementDimensions/categoryDimensions/attributeDimensions/programIndicatorDimensions
            var possibleDimensionNames=['dataElement','category','attribute','programIndicator','indicator'];
            //Check for dimensions definitions for addition of legendset
            //Deduce e.g. dataElementDimension from possibleDimensionName+'Dimensions'
            angular.forEach(possibleDimensionNames,function(possibleDimensionName){
                if(angular.isDefined(dashboardItem.object[possibleDimensionName+'Dimensions'])) {
                    angular.forEach(dashboardItem.object[possibleDimensionName+'Dimensions'],function(possibleDimension){
                        //Append Legendset if it exists
                        if(angular.isDefined(possibleDimension['legendSet'])) {
                            $scope.dimensionDetails.legendSet[ possibleDimension[possibleDimensionName].id ]= possibleDimension['legendSet'].id
                        }
                        //Prepare metadata for the dimension
                        if(possibleDimensionName=='dataElement' && angular.isDefined(possibleDimension['dataElement'])) {
                            //Construct meta-dataDimension
                            //pull attribute options
                            //@todo replace ajax calls to data elements with analytics embedded data
                            $scope.promises.push($http.get('../../../api/dataElements/'+possibleDimension['dataElement'].id+'.json?fields=id,name,optionSetValue,optionSet[id,name,options[id,name,code]]')
                                .success(function(dataElementObject){
                                    $scope.dimensionDetails.metaDataNames[possibleDimension['dataElement'].id]=dataElementObject.name;
                                    $scope.dimensionDetails.metaData[possibleDimension['dataElement'].id]=[];
                                    //For dataElement of Optionset type deduce options
                                    if( dataElementObject.optionSetValue===true) {
                                        angular.forEach(dataElementObject.optionSet.options,function(option){
                                            //If filter exist only put items in the filter, else if filter doesn't exist, put it all.
                                            if(angular.isDefined(possibleDimension['filter']) && $.inArray(option.name,possibleDimension['filter'].replace(/IN:/,'').split(';'))!=0 ) {
                                                //Only place filters in the list, because filter exist
                                                $scope.dimensionDetails.metaData[possibleDimension['dataElement'].id].push(option.code);
                                                $scope.dimensionDetails.metaDataNames[option.code]=option.name;
                                                //$scope.dimensionDetails.metaDataNames[option.id]=option.name;
                                            }else if ( angular.isUndefined(possibleDimension['filter']) ) {
                                                //Place everything because filter doesn't exist
                                                $scope.dimensionDetails.metaData[possibleDimension['dataElement'].id].push(option.code);
                                                $scope.dimensionDetails.metaDataNames[option.code]=option.name;
                                                //$scope.dimensionDetails.metaDataNames[option.id]=option.name;
                                            }

                                        });
                                    }else {
                                        //For integer, pick the max-limit and deduce single digit counts as legend
                                        if(angular.isDefined(possibleDimension['filter']) && possibleDimension['filter'].search('LE')!="-1" && Number(possibleDimension['filter'].replace(/LE:/,''))!=0 ) {
                                            //Only place filters in the list, because filter exist
                                            for(i=0;i<=Number(possibleDimension['filter'].replace(/LE:/,''));i++) {

                                                $scope.dimensionDetails.metaData[possibleDimension['dataElement'].id].push(''+i+'.0');
                                                $scope.dimensionDetails.metaDataNames[''+i+'.0']=''+i+'.0';
                                                //$scope.dimensionDetails.metaDataNames[option.id]=option.name;
                                            }
                                        }else if(angular.isDefined(possibleDimension['filter']) && possibleDimension['filter'].search('GT')!="-1" && Number(possibleDimension['filter'].replace(/GT:/,''))!=0 ) {
                                            //Only place filters in the list, because filter exist
                                            //@todo learn it works and fetch max limit incase of GT filter, currently limited to only next 10
                                            var maxLimit=Number(possibleDimension['filter'].replace(/GT:/,''))+10;
                                            for(i=Number(possibleDimension['filter'].replace(/GT:/,''));i<=maxLimit;i++) {

                                                $scope.dimensionDetails.metaData[possibleDimension['dataElement'].id].push(''+i+'.0');
                                                $scope.dimensionDetails.metaDataNames[''+i+'.0']=''+i+'.0';
                                                //$scope.dimensionDetails.metaDataNames[option.id]=option.name;
                                            }
                                        }

                                    }
                                    //For dataaelement of type

                                }).error(function(errorMessage){
                                    console.log('Loading dataElement failed!');
                                    console.log(errorMessage);
                                }));

                        }
                        else if ( possibleDimensionName=='category' && angular.isDefined(possibleDimension['category']) ) {

                            //@todo replace ajax calls to categories with analytics embedded data
                            $scope.promises.push($http.get('../../../api/categories/'+possibleDimension['category'].id+'.json?fields=id,name,categoryOptions[id,name]')
                                .success(function(categoryObject){
                                    $scope.dimensionDetails.metaDataNames[possibleDimension['category'].id]=categoryObject.name;
                                    $scope.dimensionDetails.metaData[possibleDimension['category'].id]=[];
                                    angular.forEach(categoryObject.categoryOptions,function(categoryOption){
                                        $scope.dimensionDetails.metaData[possibleDimension['dataElement'].id].push(categoryOption.id);
                                        $scope.dimensionDetails.metaDataNames[categoryOption.id]=categoryOption.name;
                                    });

                                }).error(function(errorMessage){
                                    console.log('Loading dataElement failed!');
                                    console.log(errorMessage);
                                }));
                        }
                        else if ( possibleDimensionName=='attribute' && angular.isDefined(possibleDimension['attribute']) ) {
                            //@todo replace these ajax calls with analytics embedded data
                            $scope.promises.push($http.get('../../../api/trackedEntityAttributes/'+possibleDimension['attribute'].id+'.json?fields=id,name,optionSet[id,name,options[id,name,code]]')
                                .success(function(trackedEntityAttributeObject){
                                    $scope.dimensionDetails.metaDataNames[possibleDimension['attribute'].id]=trackedEntityAttributeObject.name;
                                    $scope.dimensionDetails.metaData[possibleDimension['attribute'].id]=[];
                                    if(angular.isDefined(trackedEntityAttributeObject.optionSet)) {
                                        angular.forEach(trackedEntityAttributeObject.optionSet.options,function(option){
                                            $scope.dimensionDetails.metaData[possibleDimension['attribute'].id].push(option.name);
                                            $scope.dimensionDetails.metaDataNames[option.name]=option.name;
                                        });
                                    }

                                }).error(function(errorMessage){
                                    console.log('Loading dataElement failed!');
                                    console.log(errorMessage);
                                }));
                        }
                    });
                }
            });

            //prepare column
            angular.forEach(dashboardItem.object.columns,function(dashboardItemObjectColum){
                // @todo Check for filter if it exist
                var items = "";
                var dimensionPrefix="";
                //Check if legendset exist to incorporate
                if(angular.isDefined($scope.dimensionDetails.legendSet[dashboardItemObjectColum.dimension])) {
                    dimensionPrefix="-"+$scope.dimensionDetails.legendSet[dashboardItemObjectColum.dimension];
                }
                //@todo check what dimension dy deals with, for now skip it in url,
                if(dashboardItemObjectColum.dimension!="dy") {
                    if(i == 0 ) { items += "dimension="+dashboardItemObjectColum.dimension+dimensionPrefix+':'}else{ items += "&dimension="+dashboardItemObjectColum.dimension+':' };
                }
                angular.forEach(dashboardItemObjectColum.items,function(item){
                    items += item.id+';';
                });
                if(angular.isDefined(dashboardItemObjectColum.filter)) {
                    items += dashboardItemObjectColum.filter+';';
                }
                column += items.slice(0, -1);
                i++;
            });

            //prepare rows
            angular.forEach(dashboardItem.object.rows,function(dashboardItemObjectRow){
                // @todo Check for filter if it exist
                var items = "";
                var dimensionPrefix="";
                //Check if legendset exist to incorporate
                if(angular.isDefined($scope.dimensionDetails.legendSet[dashboardItemObjectRow.dimension])) {
                    dimensionPrefix="-"+$scope.dimensionDetails.legendSet[dashboardItemObjectRow.dimension];
                }
                //@todo check what dimension dy deals with, for now skip it in url,
                if(dashboardItemObjectRow.dimension!="dy") {
                    items += "&dimension="+dashboardItemObjectRow.dimension+dimensionPrefix+':';
                }
                angular.forEach(dashboardItemObjectRow.items,function(item){
                    items += item.id+';';
                });
                if(angular.isDefined(dashboardItemObjectRow.filter)) {
                    items += dashboardItemObjectRow.filter+';';
                }
                row += items.slice(0, -1);
            });
            //@todo Check if value exist

            //prepare filters
            angular.forEach(dashboardItem.object.filters,function(dashboardItemObjectFilter){
                // @todo Check for filter if it exist
                var items = "";
                var dimensionPrefix="";
                //Check if legendset exist to incorporate
                if(angular.isDefined($scope.dimensionDetails.legendSet[dashboardItemObjectFilter.dimension])) {
                    dimensionPrefix="-"+$scope.dimensionDetails.legendSet[dashboardItemObjectFilter.dimension];
                }

                //@todo check what dimension dy deals with, for now skip it in url,
                if(dashboardItemObjectFilter.dimension!="dy") {
                    items += "&dimension="+dashboardItemObjectFilter.dimension+dimensionPrefix+':';
                }
                angular.forEach(dashboardItemObjectFilter.items,function(item){
                    items += item.id+';';
                });
                if(angular.isDefined(dashboardItemObjectFilter.filter)) {
                    items += dashboardItemObjectFilter.filter+';';
                }
                filter += items.slice(0, -1);
            });

            if( dashboardItem.type=="EVENT_CHART" ) {
                url += "../../../api/analytics/events/aggregate/"+dashboardItem.object.program.id+".json?stage=" +dashboardItem.object.programStage.id+"&";
            }else if ( dashboardItem.type=="EVENT_REPORT" ) {
                if( dashboardItem.object.dataType=="AGGREGATED_VALUES") {
                    url += "../../../api/analytics/events/aggregate/"+dashboardItem.object.program.id+".json?stage=" +dashboardItem.object.programStage.id+"&";
                }else {
                    url += "../../../api/analytics/events/query/"+dashboardItem.object.program.id+".json?stage=" +dashboardItem.object.programStage.id+"&";
                }

            }else if ( dashboardItem.type=="EVENT_MAP" ) {
                url +="../../../api/analytics/events/aggregate/"+dashboardItem.object.program.id+".json?stage="  +dashboardItem.object.programStage.id+"&";
            }else {
                url += "../../../api/analytics.json?";
            }

            url += column+row;
            ( filter == "" )? url+"" : url += filter;
            url += "&displayProperty=NAME"+  dashboardItem.type=="EVENT_CHART" ?
                    "&outputType=EVENT&"
                        : dashboardItem.type=="EVENT_REPORT" ?
                    "&outputType=EVENT&displayProperty=NAME"
                        : dashboardItem.type=="EVENT_MAP" ?
                    "&outputType=EVENT&displayProperty=NAME"
                        :"&displayProperty=NAME" ;

            return url;

        };

        $scope.getAnalytics = function( dashboardItem, width, prepend )
        {
            width = width || 408;
            prepend = prepend || false;

            var graphStyle = "width:" + width + "px; overflow:hidden;";
            var tableStyle = "width:" + width + "px;";
            var userOrgUnit =  [];
            $scope.dashboardLoader[dashboardItem.id] = true;
            //Handles Events and Aggregate Charts
            if ( dashboardItem.type=="CHART" || dashboardItem.type=="EVENT_CHART" )
            {
                $http.get('../../../api/'+$scope.formatEnumString(dashboardItem.type)+'s/'+dashboardItem[$scope.formatEnumString(dashboardItem.type)].id+'.json?fields=:all,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,attributeDimensions[id,name,attribute[id,name,optionSet[id,name,options[id,name]]]],dataElementDimensions[id,name,dataElement[id,name,optionSet[id,name,options[id,name]]]],categoryDimensions[id,name,category[id,name,categoryOptions[id,name,options[id,name]]]]')
                    .success(function(dashboardItemObject){
                        dashboardItem.object=dashboardItemObject;
                        var url = $scope.prepareAnalytics(dashboardItem);
                        $http.get(url)
                            .success(function(analyticsData){
                                //Accounts for events charts without series and category pre-defined
                                if(angular.isUndefined(dashboardItem.object.category)) {
                                    //No category dimension default to first row dimension
                                    if(angular.isDefined(dashboardItem.object.rows) && dashboardItem.object.rows.length>0) {
                                        dashboardItem.object.category=dashboardItem.object.rows[0].dimension;
                                    }else {
                                        //Event report that don't have single row, uses event date as rows
                                        dashboardItem.object.category="eventdate";
                                    }
                                }
                                if(angular.isUndefined(dashboardItem.object.series)) {
                                    //No series dimension default to first column dimension
                                    if(angular.isDefined(dashboardItem.object.columns) && dashboardItem.object.columns.length>0) {
                                        dashboardItem.object.series=dashboardItem.object.columns[0].dimension;
                                    }
                                }
                                //Account for additional meta-data needed by drawing chart object for events
                                $q.all($scope.promises).then(function(promiseResults){
                                    angular.extend(analyticsData.metaData.names,$scope.dimensionDetails.metaDataNames);
                                    angular.extend(analyticsData.metaData,$scope.dimensionDetails.metaData);

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
                                });

                            }).error(function(error){
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                                dashboardItem.errorMessage=JSON.stringify(error);
                            });
                    }).error(function(error){
                        console.log(error)
                        $scope.dashboardLoader[dashboardItem.id] = false;
                        $scope.dashboardFailLoad[dashboardItem.id] = true;
                        dashboardItem.errorMessage=JSON.stringify(error);
                    });

            }
            //Handles Events and Aggregate Map
            else if ( dashboardItem.type=="MAP" )
            {

                $http.get('../../../api/'+$scope.formatEnumString(dashboardItem.type)+'s/'+dashboardItem[$scope.formatEnumString(dashboardItem.type)].id+'.json?fields=*,columns[dimension,filter,items[id,undefined]],rows[dimension,filter,items[id,undefined]],filters[dimension,filter,items[id,undefined]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit,mapViews[*,columns[dimension,filter,items[id,undefined]],rows[dimension,filter,items[id,undefined]],filters[dimension,filter,items[id,undefined]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]')
                    .success(function(output){
                        var mapCenter = {zoom:5,lat:output.latitude/100000,lon:output.longitude/100000};
                        //var mapCenter = {zoom:5,lat:output.latitude,lon:output.longitude};
                        $scope.touchedFeature = {};
                        var shared = mapManager.getShared();
                        shared.facility = 3029;

                        mapManager.separateLayers(output);
                        mapManager.getOrganisationUnits();
                        mapManager.getMapLayerBoundaries(mapManager.organisationUnits,dashboardItem.id).then(function(){
                            mapManager.getMapThematicData().then(function(){
                                $scope.dashboardAnalytics[dashboardItem.id] = mapManager.analytics;
                                var mapRenderer = mapManager.renderMapLayers(mapCenter,dashboardItem.id);

                                angular.extend(dashboardItem.map,mapRenderer);
                                angular.extend(dashboardItem.map,mapManager.legendSet);

                                mapManager.registerMapEvents($scope,dashboardItem.id,function(scope){
                                    var featuredData = JSON.parse(localStorage.getItem(dashboardItem.id));
                                    $scope.touchedFeature[dashboardItem.id] = featuredData[scope.previousFeature];

                                    //$scope.$watch($scope.touchedFeature,function(newFeature,oldFeature){
                                    //
                                    //});

                                });

                                dashboardItem.map.columSize = {};
                                dashboardItem.map.columSize['col-md-4'] = "60%";
                                dashboardItem.map.columSize['col-md-8'] = "80%";
                                dashboardItem.map.columSize['col-md-12'] = "85%";

                                dashboardItem.map.columnLabelMarginLeft = {};
                                dashboardItem.map.columnLabelMarginLeft['col-md-4'] = "30%";
                                dashboardItem.map.columnLabelMarginLeft['col-md-8'] = "40%";
                                dashboardItem.map.columnLabelMarginLeft['col-md-12'] = "42.5%";

                                dashboardItem.map.title = output.name;
                                dashboardItem.map.title = output.name;
                                dashboardItem.map.styles = {
                                    fontSize:mapManager.thematicLayers[0].labelFontSize,
                                    fontStyle:mapManager.thematicLayers[0].labelFontStyle,
                                    fontColor:mapManager.thematicLayers[0].labelFontColor,
                                    fontWeight:mapManager.thematicLayers[0].labelFontWeight
                                }

                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = false;
                            },function(error){
                                console.log(error);
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                                dashboardItem.errorMessage=JSON.stringify(error);
                            });
                            // when map layer boundaries are successful obtained


                        },function(error){
                            // when map layer boundaries fail to load
                            console.log(error);
                            $scope.dashboardLoader[dashboardItem.id] = false;
                            $scope.dashboardFailLoad[dashboardItem.id] = true;
                            dashboardItem.errorMessage=JSON.stringify(error);
                        });
                    });

            }
            //Handles aggregate and individuala tables
            else if ( dashboardItem.type == "REPORT_TABLE" || dashboardItem.type == "EVENT_REPORT" )
            {


                $http.get('../../../api/'+$scope.formatEnumString(dashboardItem.type)+'s/'+dashboardItem[$scope.formatEnumString(dashboardItem.type)].id+'.json?fields=*,program[id,name],programStage[id,name],columns[dimension,filter,items[id,name],legendSet[id,name]],rows[dimension,filter,items[id,name],legendSet[id,name]],filters[dimension,filter,items[id,name],legendSet[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels')
                    .success(function(dashboardItemObject) {
                        dashboardItem.object = dashboardItemObject;
                        var url = $scope.prepareAnalytics(dashboardItem);
                        dashboardItem.analyticsUrl = url;
                        dashboardItem.tableName = dashboardItem.object.displayName;
                        $scope.name = dashboardItem.tableName;
                        $scope.dashboardItem = dashboardItem.tableName;
                        var column = {};
                        var rows = {};
                        var filters = {};

                        //@todo find purpose of dy, drop it for now
                        angular.forEach(['rows','columns','filters'],function(attributeInDashboardItem){
                            angular.forEach(dashboardItem.object[attributeInDashboardItem],function(objectInDashboardItemAttribute,objectInDashboardItemAttributeIndex){
                                if(objectInDashboardItemAttribute.dimension=="dy") {
                                    dashboardItem.object[attributeInDashboardItem].splice(objectInDashboardItemAttributeIndex,(objectInDashboardItemAttributeIndex+1));
                                }
                            });
                        });
                        $http.get(dashboardItem.analyticsUrl)
                            .success(function(analyticsData){

                                //Account for additional meta-data needed by drawing chart object for events
                                $q.all($scope.promises).then(function(promiseResults){
                                    angular.extend(analyticsData.metaData.names,$scope.dimensionDetails.metaDataNames);
                                    angular.extend(analyticsData.metaData,$scope.dimensionDetails.metaData);

                                    //Note: Events listing don't have rows(only columns exists), chop first column and add in row
                                    if(dashboardItem.type=='EVENT_REPORT' && angular.isDefined(dashboardItem.object.dataType) && dashboardItem.object.dataType=='EVENTS') {
                                        //Look for period dimension and rename it to event date
                                        angular.forEach(dashboardItem.object.columns,function(column,columnIndex){
                                            if(column.dimension=='pe') {
                                                column.dimension='eventdate';
                                                //Remove the first column and add it to rows
                                                var removedColumns = dashboardItem.object.columns.splice(columnIndex,(columnIndex+1));
                                                //Note:
                                                dashboardItem.object.rows.push(removedColumns[0]);
                                            }
                                        });
                                        //Construct meta-data for events
                                        analyticsData.metaData.names['eventdate']="Event Date";
                                        //Go through list of values to produce array for event date and orgunits

                                    }

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
                                });

                            }).error(function(error){
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                                console.log(error);
                                dashboardItem.errorMessage=JSON.stringify(error);
                            });
                    }).error(function(error){
                        $scope.dashboardLoader[dashboardItem.id] = false;
                        $scope.dashboardFailLoad[dashboardItem.id] = true;
                        console.log(error);
                        dashboardItem.errorMessage=JSON.stringify(error);
                    });

            }
        }

        //update the dashboard acording to the filters
        $scope.updateDashboard = function(){
            angular.forEach($scope.dashboardItems,function(dashboardItem){
                $scope.dashboardLoader[dashboardItem.id] = true;
                $scope.selectedUnits=[];$scope.selectedLevel=[];$scope.selectedGroups=[];
                if($scope.linkValue=='organisation'){
                    angular.forEach($scope.userOrgUnits,function(userOrgunit){
                        if(userOrgunit.selected==true){
                            $scope.selectedUnits.push({name:userOrgunit.name,value:userOrgunit.value,selection:'organisation'});
                        }
                    });
                $scope.orgUnitsSelected=$scope.selectedUnits;
                }else if($scope.linkValue=='levels'){
                    angular.forEach($scope.data.orgUnitLevels,function(orgUnitLevel){
                        $scope.selectedLevel.push({name:orgUnitLevel.name,value:'LEVEL-'+orgUnitLevel.level,selection:'levels'});
                    });
                    $scope.orgUnitsSelected=$scope.selectedLevel;
                }else if($scope.linkValue=='groups'){
                    angular.forEach($scope.data.orgUnitGroups,function(orgUnitGroup){
                        $scope.selectedGroups.push({name:orgUnitGroup.name,value:'OU_GROUP-'+orgUnitGroup.id,selection:'groups'});
                    });
                    $scope.orgUnitsSelected=$scope.selectedGroups;
                }else{
                    $scope.orgUnitsSelected=null;
                }
                var analyticsUrl = filtersManager.getAnalyticsLink($scope.data.outOrganisationUnits,$scope.data.outOrPeriods,$scope.dashboardDataElements[dashboardItem.id],$scope.orgUnitsSelected);
                $http.get(analyticsUrl)
                    .success(function(analyticsData){
                        $scope.hideFilters();
                        $scope.dashboardLoader[dashboardItem.id] = false;
                        $scope.dashboardFailLoad[dashboardItem.id] = false;
                        $scope.dashboardAnalytics[dashboardItem.id] = analyticsData;

                        //update dashboard filters
                        dashboardItem.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis);
                        dashboardItem.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartYAxis);
                        dashboardItem.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartYAxis);
                        dashboardItem.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis);
                        if(dashboardItem.type == 'CHART'){
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart(analyticsData,dashboardItem.chartXAxis,[],dashboardItem.chartYAxis,[],'none','',dashboardItem.object.name,$scope.dashboardChartType[dashboardItem.id])

                        }else if(dashboardItem.type == 'MAP'){
                            //mpande
                        }
                        else if(dashboardItem.type == 'REPORT_TABLE'|| dashboardItem.type=='EVENT_REPORT'){
                            var columns = {};
                            var rows = {};
                            var filters = {};
                            //Note: Events listing don't have rows, chop first column and add in row
                            var firstColumnToMove=null;
                            if(dashboardItem.type=='EVENT_REPORT' && angular.isDefined(dashboardItem.object.dataType) && dashboardItem.object.dataType=='EVENTS') {
                                //rEMOV
                            }

                            $scope.dimensions = {
                                selected: null,
                                axises: {"xAxis": [], "yAxis": [],"filter":[]}
                            };
                            angular.forEach(dashboardItem.object.rows,function(row){
                                rows['rows']=row.dimension;
                                $scope.dimensions.axises.xAxis.push({label:row.dimension,name:analyticsData.metaData.names[row.dimension]});
                            });
                            angular.forEach(dashboardItem.object.columns, function (col) {
                                columns['column'] = col.dimension;
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
                            if (dashboardItem.object.columns.length == 2){
                                $scope.tableDimension[dashboardItem.id]='2';
                                var firstDimension=dashboardItem.object.columns[0].dimension;
                                var secondDimension=dashboardItem.object.columns[1].dimension;
                                $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,firstDimension,secondDimension);
                                $scope.secondColumn[dashboardItem.id]=TableRenderer.drawTableWithTwoHeader(analyticsData,firstDimension,secondDimension);
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension(analyticsData,rows.row,firstDimension,secondDimension);
                            }else if(dashboardItem.object.rows.length == 2){
                                $scope.tableDimension[dashboardItem.id]='3';
                                var firstRow=dashboardItem.object.rows[0].dimension;
                                var secondRow=dashboardItem.object.rows[1].dimension;
                                $scope.column[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,columns.column," ");
                                $scope.firstRow[dashboardItem.id]=TableRenderer.drawTableWithSingleRowDimension(analyticsData,firstRow,secondRow);
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension(analyticsData,firstRow,columns.column,secondRow);
                            }else{
                                $scope.tableDimension[dashboardItem.id]='1';
                                var row='';
                                if(typeof rows.row =='undefined'){
                                    row='ou';
                                }else{
                                    row=rows.row;
                                }
                                $scope.headers[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,columns.column," ");
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw(analyticsData,row,columns.column);
                            }
                        }


                    }).error(function(error){
                        $scope.dashboardLoader[dashboardItem.id] = false;
                        $scope.dashboardFailLoad[dashboardItem.id] = true;
                        console.log(error);
                        dashboardItem.errorMessage=JSON.stringify(error);
                    });

            });

        };

        //update the dashboard according to the filters on a single dashboard Items
        $scope.updateFromDashboard = function(dashboardItem){
                $scope.dashboardLoader[dashboardItem.id] = true;
            $scope.selectedUnits=[];$scope.selectedLevel=[];$scope.selectedGroups=[];
            if($scope.linkValue=='organisation'){
                angular.forEach($scope.userOrgUnitsToCards,function(value){
                    if(value.selected==true){
                        $scope.selectedUnits.push({name:value.name,value:value.value,selection:'organisation'});
                    }
                });
                $scope.orgUnitsSelected=$scope.selectedUnits;
            }else if($scope.linkValue=='levels'){
                angular.forEach($scope.data.orOutgUnitLevels,function(value){
                    $scope.selectedLevel.push({name:value.name,value:'LEVEL-'+value.level,selection:'levels'});
                });
                $scope.orgUnitsSelected=$scope.selectedLevel;
            }else if($scope.linkValue=='groups'){
                angular.forEach($scope.data.orOutgUnitGroups,function(value){
                    $scope.selectedGroups.push({name:value.name,value:'OU_GROUP-'+value.id,selection:'groups'});
                });
                $scope.orgUnitsSelected=$scope.selectedGroups;
            }else{
                $scope.orgUnitsSelected=null;
            }
              var analyticsUrl = filtersManager.getAnalyticsLink(dashboardItem.outOrganisationUnits,dashboardItem.outOrPeriods,$scope.dashboardDataElements[dashboardItem.id],$scope.orgUnitsSelected);
                $http.get(analyticsUrl)
                    .success(function(analyticsData){

                        $scope.dashboardLoader[dashboardItem.id] = false;
                        $scope.dashboardFailLoad[dashboardItem.id] = false;
                        $scope.dashboardAnalytics[dashboardItem.id] = analyticsData;

                        //update dashboard filters
                        dashboardItem.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis);
                        dashboardItem.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartYAxis);
                        dashboardItem.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartYAxis);
                        dashboardItem.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis);
                        if(dashboardItem.type == 'CHART'){
                            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart(analyticsData,dashboardItem.chartXAxis,[],dashboardItem.chartYAxis,[],'none','',dashboardItem.object.name,$scope.dashboardChartType[dashboardItem.id])

                        }else if(dashboardItem.type == 'MAP'){
                            mapManager.getOrganisationUnitsFromTree(dashboardItem.outOrganisationUnits);
                            mapManager.period = dashboardItem.outOrPeriods;
                            //mapManager.setOriginalAnalytics($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.id);

                            $scope.touchedFeature[dashboardItem.id] = {};
                            $scope.dashboardLoader[dashboardItem.id] = true;
                            $scope.dashboardFailLoad[dashboardItem.id] = false;
                            dashboardItem.type='MAP';
                            dashboardItem.map = {};
                            //mapManager.prepareMapProperties(dashboardItem);
                            mapManager.getMapLayerBoundaries(mapManager.organisationUnits,dashboardItem.id).then(function(){
                                mapManager.getMapThematicData().then(function(){
                                    localStorage.setItem(dashboardItem.id,JSON.stringify(mapManager.featuredData));
                                    //$scope.dashboardAnalytics[dashboardItem.id] = mapManager.analytics;
                                    var mapCenter = {zoom: 5, lat: -7.139309343279099, lon: 38.864305898301}; /// TODO writing a function to center map drawn from chart and table anlytic object
                                    var mapRenderer = mapManager.renderMapLayers(mapCenter,dashboardItem.id);
                                    angular.extend(dashboardItem.map,mapRenderer);
                                    angular.extend(dashboardItem.map,mapManager.legendSet);

                                    mapManager.registerMapEvents($scope,dashboardItem.id,function(scope){
                                        var featuredData = JSON.parse(localStorage.getItem(dashboardItem.id));
                                        $scope.touchedFeature[dashboardItem.id] = featuredData[scope.previousFeature];
                                        $scope.$watch($scope.touchedFeature[dashboardItem.id],function(newFeature,oldFeature){
                                        });

                                        $scope.currentDashboard = null;
                                        $scope.$on("trackDashboard",function(event,daschboard_id){
                                            $scope.currentDashboard = daschboard_id;
                                        });

                                    });

                                    dashboardItem.map.columSize = {};
                                    dashboardItem.map.columSize['col-md-4'] = "60%";
                                    dashboardItem.map.columSize['col-md-8'] = "80%";
                                    dashboardItem.map.columSize['col-md-12'] = "85%";

                                    dashboardItem.map.columnLabelMarginLeft = {};
                                    dashboardItem.map.columnLabelMarginLeft['col-md-4'] = "30%";
                                    dashboardItem.map.columnLabelMarginLeft['col-md-8'] = "40%";
                                    dashboardItem.map.columnLabelMarginLeft['col-md-12'] = "42.5%";

                                    dashboardItem.map.title = mapManager.thematicLayers[0].name;
                                    dashboardItem.map.title = mapManager.thematicLayers[0].name;
                                    dashboardItem.map.styles = {
                                        fontSize:mapManager.thematicLayers[0].labelFontSize,
                                        fontStyle:mapManager.thematicLayers[0].labelFontStyle,
                                        fontColor:mapManager.thematicLayers[0].labelFontColor,
                                        fontWeight:mapManager.thematicLayers[0].labelFontWeight
                                    }

                                    $scope.dashboardLoader[dashboardItem.id] = false;
                                    $scope.dashboardFailLoad[dashboardItem.id] = false;
                                },function(error){
                                    $scope.dashboardLoader[dashboardItem.id] = false;
                                    $scope.dashboardFailLoad[dashboardItem.id] = true;
                                    console.log(error);
                                    dashboardItem.errorMessage=JSON.stringify(error);
                                });
                            },function(error){
                                $scope.dashboardLoader[dashboardItem.id] = false;
                                $scope.dashboardFailLoad[dashboardItem.id] = true;
                                console.log(error);
                                dashboardItem.errorMessage=JSON.stringify(error);
                            });


                        }else if(dashboardItem.type == 'REPORT_TABLE' || dashboardItem.type=='EVENT_REPORT'){
                            var columns = {};
                            var rows = {};
                            var filters = {};
                            $scope.dimensions = {
                                selected: null,
                                axises: {"xAxis": [], "yAxis": [],"filter":[]}
                            };
                            angular.forEach(dashboardItem.object.rows,function(row){
                                rows['rows']=row.dimension;
                                $scope.dimensions.axises.xAxis.push({label:row.dimension,name:analyticsData.metaData.names[row.dimension]});
                            });
                            angular.forEach(dashboardItem.object.columns, function (col) {
                                columns['column'] = col.dimension;
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
                            if (dashboardItem.object.columns.length == 2){
                                $scope.tableDimension[dashboardItem.id]='2';
                                var firstDimension=dashboardItem.object.columns[0].dimension;
                                var secondDimension=dashboardItem.object.columns[1].dimension;
                                $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,firstDimension,secondDimension);
                                $scope.secondColumn[dashboardItem.id]=TableRenderer.drawTableWithTwoHeader(analyticsData,firstDimension,secondDimension);
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoRowDimension(analyticsData,rows.row,firstDimension,secondDimension);
                            }else if(dashboardItem.object.rows.length == 2){
                                $scope.tableDimension[dashboardItem.id]='3';
                                var firstRow=dashboardItem.object.rows[0].dimension;
                                var secondRow=dashboardItem.object.rows[1].dimension;
                                $scope.column[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,columns.column," ");
                                $scope.firstRow[dashboardItem.id]=TableRenderer.drawTableWithSingleRowDimension(analyticsData,firstRow,secondRow);
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.drawTableWithTwoColumnDimension(analyticsData,firstRow,columns.column,secondRow);
                            }else{
                                $scope.tableDimension[dashboardItem.id]='1';
                                var row='';
                                if(typeof rows.row =='undefined'){
                                    row='ou';
                                }else{
                                    row=rows.row;
                                }
                                $scope.headers[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal(analyticsData,columns.column," ");
                                $scope.dashboardTab[dashboardItem.id]=TableRenderer.getMetadataItemsTableDraw(analyticsData,row,columns.column);
                            }
                        }

                    }).error(function(error){
                        $scope.dashboardLoader[dashboardItem.id] = false;
                        $scope.dashboardFailLoad[dashboardItem.id] = true;
                        console.log(error);
                        dashboardItem.errorMessage=JSON.stringify(error);
                    });


        };

        //update the dashboard according to the filters
        $scope.updateSingleDashboard = function(dashboardItem,chartType){

            //Set current visualization
            dashboardItem.currentVisualization=chartType;
            //$scope.touchedFeature[dashboardItem.id] = {name:"",value:""};
           $scope.dashboardChartType[dashboardItem.id] = chartType;
            $scope.touchedFeature = {};
            if( dashboardItem.currentVisualization == 'table') {
                if(mapManager.originalAnalytics.headers){
                    $scope.dashboardAnalytics[dashboardItem.id] = mapManager.getOriginalAnalytics(dashboardItem.id);
                }
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
                dashboardItem.columnLength=$scope.dimensions.axises.yAxis.length;
                dashboardItem.rowLenth=$scope.dimensions.axises.xAxis.length;
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
            else if(dashboardItem.currentVisualization == 'map') {
                mapManager.setOriginalAnalytics($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.id);

                $scope.touchedFeature[dashboardItem.id] = {};
                $scope.dashboardLoader[dashboardItem.id] = true;
                $scope.dashboardFailLoad[dashboardItem.id] = false;
                dashboardItem.map = {};
                mapManager.prepareMapProperties(dashboardItem);
                mapManager.getMapLayerBoundaries(mapManager.organisationUnits,dashboardItem.id).then(function(){
                mapManager.getMapThematicData().then(function(){
                    localStorage.setItem(dashboardItem.id,JSON.stringify(mapManager.featuredData));
                    //$scope.dashboardAnalytics[dashboardItem.id] = mapManager.analytics;
                    var mapCenter = {zoom: 5, lat: -7.139309343279099, lon: 38.864305898301}; /// TODO writing a function to center map drawn from chart and table anlytic object
                    var mapRenderer = mapManager.renderMapLayers(mapCenter,dashboardItem.id);
                    angular.extend(dashboardItem.map,mapRenderer);
                    angular.extend(dashboardItem.map,mapManager.legendSet);

                    mapManager.registerMapEvents($scope,dashboardItem.id,function(scope){
                        var featuredData = JSON.parse(localStorage.getItem(dashboardItem.id));
                        $scope.touchedFeature[dashboardItem.id] = featuredData[scope.previousFeature];
                        $scope.$watch($scope.touchedFeature[dashboardItem.id],function(newFeature,oldFeature){
                        });

                        $scope.currentDashboard = null;
                        $scope.$on("trackDashboard",function(event,daschboard_id){
                            $scope.currentDashboard = daschboard_id;
                        });

                    });

                    dashboardItem.map.columSize = {};
                    dashboardItem.map.columSize['col-md-4'] = "60%";
                    dashboardItem.map.columSize['col-md-8'] = "80%";
                    dashboardItem.map.columSize['col-md-12'] = "85%";

                    dashboardItem.map.columnLabelMarginLeft = {};
                    dashboardItem.map.columnLabelMarginLeft['col-md-4'] = "30%";
                    dashboardItem.map.columnLabelMarginLeft['col-md-8'] = "40%";
                    dashboardItem.map.columnLabelMarginLeft['col-md-12'] = "42.5%";

                    dashboardItem.map.title = mapManager.thematicLayers[0].name;
                    dashboardItem.map.title = mapManager.thematicLayers[0].name;
                    dashboardItem.map.styles = {
                        fontSize:mapManager.thematicLayers[0].labelFontSize,
                        fontStyle:mapManager.thematicLayers[0].labelFontStyle,
                        fontColor:mapManager.thematicLayers[0].labelFontColor,
                        fontWeight:mapManager.thematicLayers[0].labelFontWeight
                    }

                    $scope.dashboardLoader[dashboardItem.id] = false;
                    $scope.dashboardFailLoad[dashboardItem.id] = false;
                },function(error){
                    $scope.dashboardLoader[dashboardItem.id] = false;
                    $scope.dashboardFailLoad[dashboardItem.id] = true;
                    console.log(error);
                    dashboardItem.errorMessage=JSON.stringify(error);
                });
                },function(error){
                    $scope.dashboardLoader[dashboardItem.id] = false;
                    $scope.dashboardFailLoad[dashboardItem.id] = true;
                    console.log(error);
                    dashboardItem.errorMessage=JSON.stringify(error);
                });
            }
            else if(dashboardItem.currentVisualization=='interpretation'){
                dashboardItem.column_size = 'col-md-12';
                dashboardItem.laodingInterpetation =  true;
                $scope.getInterpretations(dashboardItem).then(function(data){
                    dashboardItem.interpretations = data;
                    dashboardItem.laodingInterpetation =  false;
                })
            }
            else{

                if(mapManager.originalAnalytics.headers){
                    $scope.dashboardAnalytics[dashboardItem.id] = mapManager.getOriginalAnalytics(dashboardItem.id);
                }

                var xItems = dashboardItem.xAxisData.map(function(a) {return a.id;});
                var yItems = dashboardItem.yAxisData.map(function(a) {return a.id;});
                $scope.dashboardLoader[dashboardItem.id] = true;
                $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id],dashboardItem.chartXAxis,xItems,dashboardItem.chartYAxis,yItems,'none','',dashboardItem.object.name,chartType)
                $scope.dashboardLoader[dashboardItem.id] = false;
            }

            if(dashboardItem.currentVisualization=='details'){
                var analyticsObject=$scope.dashboardAnalytics[dashboardItem.id];
                var dataElementArray=[];
                var indicatorArray=[];
                var datasetArray=[];
                angular.forEach(analyticsObject.metaData.dx,function(dxUid){
                    $scope.dashboardLoader[dashboardItem.id] = true;
                    var dataElementApi=
                        $resource('../../../api/dataElements/'+dxUid+'.json?fields=id,name,aggregationType,displayName,categoryCombo[id,name,categories[id,name,categoryOptions[id,name]]],dataSets[id,name,periodType]',{get:{method:"JSONP"}});
                    var dataelements=dataElementApi.get(function(dataElementObject){
                        dataElementArray.push(dataElementObject);
                        $scope.dataElements[dashboardItem.id]=dataElementArray;
                        console.log($scope.dataElements[dashboardItem.id]);
                        $scope.dashboardLoader[dashboardItem.id] = false;
                    },function(response){
                        if(response.status==404){
                            var indicatorApi=
                                $resource('../../../api/indicators/'+dxUid+'.json?fields=displayName,id,name,numeratorDescription,denominatorDescription,denominator,numerator,indicatorType[id,name],dataSets[id,name,periodType]',{get:{method:"JSONP"}});
                            var indicators=indicatorApi.get(function(indicatorObject){
                                var expApi=
                                    $resource('../../../api/expressions/description',{get:{method:"JSONP"}});
                                var numeratorExp=expApi.get({expression:indicatorObject.numerator},function(numeratorText){
                                    var numerator=numeratorText.description;
                                    var denominatorExp=expApi.get({expression:indicatorObject.denominator},function(denominatorText){
                                        var denominator=denominatorText.description;
                                        indicatorArray.push({name:indicatorObject.name,uid:indicatorObject.id,denominatorDescription:indicatorObject.denominatorDescription,numeratorDescription:indicatorObject.numeratorDescription,numerator:numerator,denominator:denominator,indicatorType:indicatorObject.indicatorType,dataSets:indicatorObject.dataSets});
                                        $scope.indicators[dashboardItem.id]=indicatorArray;
                                        console.log($scope.indicators[dashboardItem.id]);
                                        $scope.dashboardLoader[dashboardItem.id] = false;
                                    });
                                });

                            },function(rensponse){
                                if(response.status===404){
                                    var datasetApi=
                                        $resource('../../../api/dataSets/'+dxUid +'.json?fields=id,name,periodType,shortName,categoryCombo[id,name,categories[id,name,categoryOptions[id,name]]]',{get:{method:"JSONP"}});
                                    var dataSets=datasetApi.get(function(datasetObject) {
                                        datasetArray.push(datasetObject);
                                        $scope.datasets[dashboardItem.id] =datasetArray;
                                        $scope.dashboardLoader[dashboardItem.id] = false;
                                    });
                                }

                            })
                        }

                    });
                });
            }

        };

        //saving interpration comment
        $scope.saveInterpreationComment = function(dashboardItem,interpration,comment){
            interpration.savingComment = true;
            $http({
                method: 'POST',
                url: '../../../api/interpretations/'+interpration.id+'/comment',
                data: comment,
                headers: {
                    'Content-Type': 'text/html'
                }}).then(function(result) {
                $scope.getInterpretations(dashboardItem).then(function(items){
                    interpration.savingComment = false;
                    interpration.newComment = '';
                    dashboardItem.interpretations = items;
                });
            }, function(error) {
                console.log(error);
            });
        };

        //save new interpretaion
        $scope.saveInterpreation = function(dashboardItem,type,id,comment){
            dashboardItem.savingInterpretation = true;
            $http({
                method: 'POST',
                url: '../../../api/interpretations/'+type+'/'+id,
                data: comment,
                headers: {
                    'Content-Type': 'text/html'
                }}).then(function(result) {
                $scope.getInterpretations(dashboardItem).then(function(items){
                    dashboardItem.savingInterpretation = false;
                    dashboardItem.new_interpretation = '';
                    dashboardItem.interpretations = items;
                });
            }, function(error) {
                console.log(error);
            });
        };

        //update the dashboard charts according to layout selection
        $scope.updateChartLayout = function(dashboardItem,chartType,xAxis,yAxis) {
            dashboardItem.chartXAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],xAxis);
            dashboardItem.chartYAxisItems = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],yAxis);
            dashboardItem.yAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],yAxis);
            dashboardItem.xAxisData       = chartsManager.getDetailedMetadataArray($scope.dashboardAnalytics[dashboardItem.id],xAxis);
            $scope.dashboardLoader[dashboardItem.id] = true;
            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id], xAxis, [], yAxis, [], 'none', '', dashboardItem.object.name, chartType)
            $scope.dashboardLoader[dashboardItem.id] = false;
        };

        //update the dashboard charts according to layout selection
        $scope.updateChartDataSelection = function(dashboardItem,chartType,xAxis,yAxis,xAxisItems,yAxisItems) {
            var xItems = xAxisItems.map(function(a) {return a.id;});
            var yItems = yAxisItems.map(function(a) {return a.id;});
            $scope.dashboardLoader[dashboardItem.id] = true;
            $scope.dashboardChart[dashboardItem.id] = chartsManager.drawChart($scope.dashboardAnalytics[dashboardItem.id], xAxis, xItems, yAxis, yItems, 'none', '', dashboardItem.object.name, chartType)
            $scope.dashboardLoader[dashboardItem.id] = false;
        }
        $scope.updateTableLayout=function(dashboardItem,columns,rows){
            //@todo remvoving the dimension hard-coding limited to 3 dimensions
              dashboardItem.columnLength=columns.length
              dashboardItem.rowLenth=rows.length
            if (columns.length == 2 && rows.length==1){
                $scope.tableDimension[dashboardItem.id]=dashboardItem.columnLength;
                var firstDimension=columns[0].label;
                var secondDimension=columns[1].label;
                var rows=rows[0].label;
                $scope.firstColumn[dashboardItem.id]=TableRenderer.drawTableHeaderWithNormal($scope.dashboardAnalytics[dashboardItem.id],firstDimension,second);
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
            });
            if(dashboardItem.object.dataType=='EVENTS') {
                //@todo remove work around
                //For events no rows will be found return rows of the analytics
                if(angular.isDefined($scope.dashboardAnalytics[dashboardItem.id].headers[0].name) && $scope.dashboardAnalytics[dashboardItem.id].headers[0].name=="psi" ) {
                    var items=[];
                    angular.forEach($scope.dashboardAnalytics[dashboardItem.id].rows,function(row){
                        var columns={"name": row[5]};
                        angular.forEach(row,function(rowCell,rowCellIndex){
                            if(rowCellIndex>1 && $scope.dashboardAnalytics[dashboardItem.id].headers[rowCellIndex].name!="ouname" && $scope.dashboardAnalytics[dashboardItem.id].headers[rowCellIndex].name!="longitude" &&  $scope.dashboardAnalytics[dashboardItem.id].headers[rowCellIndex].name!="latitude" &&  $scope.dashboardAnalytics[dashboardItem.id].headers[rowCellIndex].name!="oucode" &&  $scope.dashboardAnalytics[dashboardItem.id].headers[rowCellIndex].name!="ou" ) {
                                columns[$scope.dashboardAnalytics[dashboardItem.id].headers[rowCellIndex].column]=rowCell;
                            }
                        });
                        items.push(columns);
                        columns=null;
                    })

                }
            }
            return items;
        };
        $scope.singleDashboardDetails=function(dashboardItem,type){

        };

        //create, manage and share dashboard modules
        //@todo cleaning up the code
        $scope.createHidden = true;
        $scope.editHidden = true;
        $scope.initHidden = false;
        $scope.shareHidden = true;


        var notificationAlert = function(title, content, type) {
            $alert({title: title,
                content: content,
                placement: 'top-right',
                type: type,
                show: true});
        }

        var modal = $modal({
            controller: 'DashboardController',
            placement: 'center',
            contentTemplate: 'views/templates/delete.html',
            show: false
        });
        $scope.deleteAlert = function() {
            modal.$promise.then(modal.show)
        }

        $scope.toggleDashboardOptions = function(option) {
            if(option == 'create') {
                $scope.createHidden = false;
                $scope.editHidden = true;
                $scope.initHidden = true;
                $scope.shareHidden = true;
                $scope.filterShownClass = 'col-sm-10';
            } else if(option == 'edit') {
                $scope.createHidden = true;
                $scope.editHidden = false;
                $scope.initHidden = true;
                $scope.shareHidden = true;
                $scope.filterShownClass = 'col-sm-10';

            } else if(option == 'share') {
                $scope.createHidden = true;
                $scope.editHidden = true;
                $scope.initHidden = true;
                $scope.shareHidden = false;
                $scope.filterShownClass = 'col-sm-9';
                getShareData();

            } else {
                $scope.createHidden = true;
                $scope.editHidden = true;
                $scope.initHidden = false;
                $scope.shareHidden = true;
                $scope.filterShownClass = 'col-sm-10';
            }


        }

        //Initialize sharing variables
        $scope.shareData = [];
        $scope.userGroups = [];
        var shareMetaData = {};
        $scope.isShareShown = false;
        $scope.isShareSearchShown = false;

        //Get data after share button has been hit
        var getShareData = function() {
            var url = '/api/sharing';
            var currentDashboardId = $routeParams.dashboardid;

            $http({
                method: 'GET',
                url: url,
                params: { type: 'dashboard', id: currentDashboardId }
            }).success(function(response) {
                //get the data
                var data = response;
                $scope.shareData = data.object;

                //Get metadata
                shareMetaData = data.meta;

                //Get user group fro the obtained data, this is to populate  userGroupAccesses section
                var userGroup = $scope.shareData.userGroupAccesses;

                if(userGroup != undefined) {
                    $scope.userGroups = userGroup;
                }
               // console.log($scope.userGroups);
            }).error(function() {
                //@ todo handle situation when there is failure
            });
        }

        //Search for user groups to be added
        $scope.searchUserGroup = function(query) {
            var url = '/api/sharing/search?';
            $http({
                method: 'GET',
                url: url,
                params: { key: query, pageSize: 20}
            }).then(function(response) {

                //Check if search comes with data
                if(!(angular.equals({}, response.data))) {
                    $scope.isShareSearchShown = true;
                    $scope.userGroup = response.data;
                } else {
                    $scope.isShareSearchShown = false;

                }
            });
        }

        //functions to show and hide search bar
        //@todo has to be one function for both
        $scope.hideSearch = function() {
            $scope.isShareSearchShown = false;
        }
        $scope.showSearch = function(query) {
           var isShown = $scope.isShareSearchShown;
           if(isShown == false && query == '') {
               $scope.isShareSearchShown = false;
           } else {
               $scope.isShareSearchShown = true;
           }
        }

        //Add user group to a userGroups scope for saving and displaying
        //@todo two functions to be included as one .i.e. to compileUserGroups
        $scope.addUserGroup = function(user) {
            $scope.isShareSearchShown = false;
            user.access = 'r-------';
            $scope.userGroups.push(user);
        };

        //Remove user group from a userGroups scope for saving
        $scope.removeUserGroup = function(user) {
            $scope.userGroups.pop(user);
        }


        $scope.saveShareData = function() {
            //variable to hold all changed data objects and meta
            var finalShareData = {};

            //Get current dashboard id
            var currentDashboardId = $routeParams.dashboardid;
            finalShareData.meta = shareMetaData;
            $scope.shareData.userGroupAccesses = $scope.userGroups;
            finalShareData.object = $scope.shareData;
            $http({
                method: 'POST',
                url: '/api/sharing?type=dashboard&id=' + currentDashboardId,
                data: finalShareData
            }).success(function(response) {
                $rootScope.filtersHidden = true;
                notificationAlert('Success', 'Dashboard has been shared successfully', 'success')
            }).error(function(error){
                notificationAlert('Error:', 'Seems there is a problem sharing', 'warning');
                //@ todo handle situation when there is failure
            })
        }


        $scope.createDashboard = function(name) {
            dashboardsManager.addDashboard({name: name})
                .then(function(dashboardId) {
                    userAccount.getUsername()
                        .then(function(username) {
                            //update local storage
                            $localStorage['dashboard.current.' + username] = dashboardId;
                            $location.path('/dashboards/' + dashboardId +'/dashboard');
                            $rootScope.filtersHidden = true;
                        });
                })
        }


        $scope.renameDashboard = function(dashboardName) {
            dashboardsManager.updateDashboardName({id: $routeParams.dashboardid, name: dashboardName})
                .then(function(response) {
                        notificationAlert('Success', 'Dashboard updated', 'success')
                },
                function(error) {
                    notificationAlert('Whoops!', 'Update has failed', 'danger')
                })


        }

        $scope.deleteDashboard = function() {
            var currentDashboardId = $routeParams.dashboardid;
            dashboardsManager.deleteDashboard($routeParams.dashboardid)
                .then(function(success) {
                    userAccount.getUsername()
                        .then(function(username) {
                            //update local storage
                            delete $localStorage['dashboard.current.' + username];
                            $location.path('/');
                            $rootScope.filtersHidden = true;
                        });
                    notificationAlert('Success', 'Dashboard deleted!', 'success')
                }, function() {
                    notificationAlert('Whoops!', 'Delete has failed', 'danger')
                })
        }


    }]);

