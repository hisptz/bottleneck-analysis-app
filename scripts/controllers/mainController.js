var mainController  = angular.module('mainController',[]);

mainController.controller('MenuController',['$scope','$window','dashboardsManager','$resource','$location',function($scope,$window,
                                                                                                       dashboardsManager,$resource,$location){

    dashboardsManager.loadAllDashboards().then(function(dashboards){
        $scope.dashboards = dashboards;
        $resource('../../../api/organisationUnits.json?userOnly=true&fields=id,name,undefined,children[id,name,undefined]&paging=false')
            .get(function(orgUnitResult){
                $scope.orgUnits=orgUnitResult.organisationUnits;
                angular.forEach($scope.orgUnits,function(childOrg){
                    $scope.childOrg=childOrg.children;
                });
                $location.path("/dashboards/" + $scope.dashboards[0].id + "/dashboard");
            });
        $scope.year=new Date().getFullYear();
        $scope.period=$scope.year;
    })
}])
    .controller('MainController',['$scope','dashboardsManager','chartsManager','TableRenderer','$timeout','$translate','$anchorScroll','Paginator','ContextMenuSelectedItem','$filter',
        '$http','CustomFormService','DHIS2URL',function($scope,
                                                                        dashboardsManager,
                                                                        chartsManager,
                                                                        TableRenderer,
                                                                        $timeout,
                                                                        $translate,
                                                                        $anchorScroll,
                                                                        Paginator,
                                                                        ContextMenuSelectedItem,
                                                                        $filter,
                                                                        $http,
                                                                        CustomFormService,
                                                                        DHIS2URL
    ){

        $scope.loading = false;

    }])
