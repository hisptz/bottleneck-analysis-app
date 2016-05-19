var mainController  = angular.module('mainController',[]);

mainController.controller('MenuController',['$scope','$window','$http','dashboardsManager','$resource','$location','$routeParams','$localStorage','$sessionStorage',function($scope,$window,$http,
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
                if(angular.isUndefined($routeParams.dashboardid)) {
                    //On first landing choose landing from local storage or default to first dashboard
                    console.log('NO LANDING PAGE SET');
                    $scope.$storage = $localStorage;
                    $http.get('../../../api/me/user-acount.json').success(function(userAccount){
                        $scope.currentUser=userAccount;
                        console.log('CURRENT USER IS:'+$scope.currentUser.username);
                        console.log('looking for localstorage with name:'+'dashboard.current.'+$scope.currentUser.username);
                        if(angular.isDefined($localStorage['dashboard.current.'+$scope.currentUser.username])) {
                            console.log('LOCAL STORAGE FOUND WITH THE USERNAME, landing should work!!');
                            $location.path("/dashboards/" + $localStorage['dashboard.current.'+$scope.currentUser.username] + "/dashboard");
                        }else {
                            console.log('LOCAL STORAGE WITH USERNAME WASNT FOUND, defaulting to first page');
                            //@todo handle situation when there isn't a single dashboard
                            $location.path("/dashboards/" + $scope.dashboards[0].id + "/dashboard");
                        }
                    }).error(function(errorMessage){
                        //When ajax fails resort to first dashboardItem
                        //@todo handle situation when there isn't a single dashboard
                        $location.path("/dashboards/" + $scope.dashboards[0].id + "/dashboard");
                    });
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
