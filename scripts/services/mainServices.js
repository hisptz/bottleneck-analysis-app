var mainServices = angular.module('mainServices',['ngResource'])
    .constant('DHIS2URL', '../../..');
mainServices.factory('dashboardsManager',['$http','$q','Dashboard','DashboardItem',function($http,$q,DHIS2URL,Dashboard,DashboardItem){

    var dashboardsManager = {
        _pool: {},
        _dashboardObjectName: "dashboards",
        _retrieveInstance: function(dashboardId,dashboardData){
            var instance = this._pool[dashboardId];
            if(instance){
                instance.setData(dashboardData);
            }else {
                instance = new Dashboard(dashboardData);
                this._pool[dashboardId] = instance;
            }

            return instance;
        },
        _search: function(dashboardId) {
            return this._pool[dashboardId];
        },
        _load: function(dashboardId,deferred){
            var thisDashboard = this;
            var deferred = $q.defer();
            $http.get(DHIS2URL+'/api/dashboards/'+dashboardId+'.json?paging=false&links=false')
                .success(function(dashboardData){
                    var dashboard = thisDashboard._retrieveInstance(dashboardData.id,dashboardData);
                    deferred.resolve(dashboard);
                })
                .error(function(errorMessageData){
                    console.log('error happened in loading dashboards');
                    deferred.reject();
                });
            return deferred.promise;
        },

        /* public Methods */
        /* Use this function in order to get a project instance by it's id */
        getDashboard: function(dashboardId) {
            var deferred = $q.defer();
            var dashboard = this._search(dashboardId);
            if(dashboard){
                deferred.resolve(dashboard)
            }else {
                return this._load(dashboardId,deferred);
            }
            return deferred.promise;
        },
        loadAllDashboards: function() {
            var deferred = $q.defer();
            var thisDashboard = this;
            $http.get('../../..'+'/api/dashboards'+'.json?paging=false&links=false')
                .success(function(dashboardsData){
                    var dashboards = [];
                    dashboardsData.dashboards.forEach(function(dashboardData){
                        // structure before persistance;
                        var dashboard = thisDashboard._retrieveInstance(dashboardData.id,dashboardData);
                        dashboards.push(dashboard);
                    });
                    deferred.resolve(dashboards);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },
        /* Update dashboard instance */
        setDashboard: function(dashboardData){
            var thisDashboardManager = this;
            var dashboard = this._search(dashboardData.id);
            if(dashboard) {
                dashboard.setData(dashboardData);
            }else {
                dashboard = thisDashboardManager._retrieveInstance(dashboardData);
            }
            return dashboard;
        }
    };
    return dashboardsManager;
}]);

mainServices.factory('Dashboard',['$http','$q','DashboardItem','DHIS2URL',function($http,DHIS2URL,DashboardItem,$q){
    function Dashboard(dashboardData) {
        if(dashboardData){
            this.setData(dashboardData);
        }
    };
    Dashboard.prototype = {
        setData: function(dashboardData) {
            angular.extend(this, dashboardData);
        }
    };
    return Dashboard;
}]);

mainServices.factory('dashboardItemsManager',['$http','$q','DashboardItem','DHIS2URL',function($http,$q,DHIS2URL){

    var dashboardItemsManager = {
        _pool: {},
        _dashboardItemObjectName: "dashboardItems",
        _retrieveInstance: function(dashboardItemId,dashboardItemData){
            var instance = this._pool[dashboardItemId];
            if(instance){
                instance.setData(dashboardItemData);
            }else {
                instance = new DashboardItem(dashboardItemData);
                this._pool[dashboardItemId] = instance;
            }

            return instance;
        },
        _search: function(dashboardItemId) {
            return this._pool[dashboardItemId];
        },
        _load: function(dashboardItemId,deferred){
            var thisDashboardItem = this;
            var deferred = $q.defer();
            $http.get(DHIS2URL+'/api/dashboardItems/'+dashboardItemId+'.json?paging=false&links=false')
                .success(function(dashboardItemData){
                    var dashboardItem = thisDashboardItem._retrieveInstance(dashboardItemData.id,dashboardItemData);
                    deferred.resolve(dashboardItem);
                })
                .error(function(errorMessageData){
                    console.log('error happened in loading dashboardItems');
                    deferred.reject();
                });
            return deferred.promise;
        },

        /* public Methods */
        /* Use this function in order to get a project instance by it's id */
        getDashboardItem: function(dashboardItemId) {
            var deferred = $q.defer();
            var dashboardItem = this._search(dashboardItemId);
            if(dashboardItem){
                deferred.resolve(dashboardItem)
            }else {
                return this._load(dashboardItemId,deferred);
                //deferred.resolve(this._load(projectId,deferred));
            }
            return deferred.promise;
        },
        loadAllDashboardItems: function() {
            var deferred = $q.defer();
            var thisDashboardItem = this;
            $http.get(DHIS2URL+'/api/dashboardItems'+'.json?paging=false&links=false')
                .success(function(dashboardItemsData){
                    var dashboardItems = [];
                    dashboardItemsData.dashboardItems.forEach(function(dashboardItemData){
                        // structure before persistance;
                        var dashboardItem = thisDashboardItem._retrieveInstance(dashboardItemData.id,dashboardItemData);
                        dashboardItems.push(dashboardItem);
                    });
                    deferred.resolve(dashboardItems);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },
        /* Update dashboardItem instance */
        setDashboardItem: function(dashboardItemData){
            var thisDashboardItemManager = this;
            var dashboardItem = this._search(dashboardItemData.id);
            if(dashboardItem) {
                dashboardItem.setData(dashboardItemData);
            }else {
                dashboardItem = thisDashboardItemManager._retrieveInstance(dashboardItemData);
            }
            return dashboardItem;
        }
    };
    return dashboardItemsManager;
}]);

mainServices.factory('DashboardItem',function($http,DHIS2URL,$q){
    function DashboardItem(dashboardItemData) {
        if(dashboardItemData){
            this.setData(dashboardItemData);
        }
    };
    DashboardItem.prototype = {
        setData: function(dashboardItemData) {
            angular.extend(this, dashboardItemData);
        }
    };
    return DashboardItem;
});