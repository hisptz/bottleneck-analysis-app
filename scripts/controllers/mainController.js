var mainController  = angular.module('mainController',[]);

mainController.controller('MenuController',['$scope','$window','dashboardsManager','$resource','$location','$routeParams','$localStorage','$sessionStorage',function($scope,$window,
                                                                                                       dashboardsManager,$resource,$location,$routeParams,$localStorage,
                                                                                                       $sessionStorage){

    dashboardsManager.loadAllDashboards().then(function(dashboards){
        $scope.dashboards = dashboards;
        $resource('../../../api/organisationUnits.json?userOnly=true&fields=id,name,undefined,children[id,name,undefined]&paging=false')
            .get(function(orgUnitResult){
                $scope.orgUnits=orgUnitResult.organisationUnits;
                angular.forEach($scope.orgUnits,function(childOrg){
                    $scope.childOrg=childOrg.children;
                });
                if(!angular.isDefined($routeParams.dashboardid)) {
                    //On first landing choose landing from local storage or default to first dashboard
                    $scope.$storage = $localStorage;
                    console.log('landing page is :'+$localStorage['dashboard.current.mukulu']);
                    if(angular.isDefined($localStorage['dashboard.current.mukulu'])) {
                        $location.path("/dashboards/" + $localStorage['dashboard.current.mukulu'] + "/dashboard");
                    }else {
                        $location.path("/dashboards/" + $scope.dashboards[0].id + "/dashboard");
                    }
                }
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
