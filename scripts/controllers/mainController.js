var mainController  = angular.module('mainController',[]);

mainController.controller('MenuController',['$scope','$window','dashboardsManager','$resource',function($scope,$window,
                                                                                                       dashboardsManager,$resource){

    dashboardsManager.loadAllDashboards().then(function(dashboards){
        $scope.dashboards = dashboards;
        $resource('../../../api/organisationUnits.json?userOnly=true&fields=id,name,undefined,children[id,name,undefined]&paging=false')
            .get(function(orgUnitResult){
                $scope.orgUnits=orgUnitResult.organisationUnits;
                angular.forEach($scope.orgUnits,function(childOrg){
                    $scope.childOrg=childOrg.children;
                });
            });
        $scope.year=new Date().getFullYear();
        $scope.period=$scope.year;
    })
}])
    .controller('MainController',['$scope','dashboardsManager','chartsManager','TableRenderer',
        '$modal','$timeout','$translate','$anchorScroll','Paginator','ContextMenuSelectedItem','$filter',
        '$http','GridColumnService','CustomFormService','ModalService','DialogService','DHIS2URL',function($scope,
                                                                        dashboardsManager,
                                                                        chartsManager,
                                                                        TableRenderer,
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

        $scope.loading = false;

    }])
