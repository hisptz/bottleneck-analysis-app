var mainController  = angular.module('mainController',[]);

mainController.controller('MenuController',['$scope','$window','dashboardsManager',function($scope,$window,dashboardsManager){

    dashboardsManager.loadAllDashboards().then(function(dashboards){
        $scope.dashboards = dashboards;
    })
}])
    .controller('MainController',['$scope','dashboardsManager','chartsManager',function($scope,
                                                                        dashboardsManager,
                                                                        chartsManager,
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
