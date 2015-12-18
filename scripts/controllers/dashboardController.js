var dashboardController  = angular.module('dashboardController',[]);

dashboardController.controller('DashboardController',['$scope','dashboardsManager','TableRenderer',function($scope,
                                                                        dashboardsManager,
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