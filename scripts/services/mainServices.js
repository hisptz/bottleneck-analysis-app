var mainServices = angular.module('mainServices',['ngResource'])
    .constant('DHIS2URL', '../../..');
mainServices.factory('dashboardsManager',['$http','$q','Dashboard','DashboardItem',function($http,$q,DHIS2URL,Dashboard,DashboardItem){

    var dashboardUrl = '../../../api/dashboards';
    var dashboardsManager = {
        _dashBoardsPool: {},
        _dashboardObjectName: "dashboards",
        _retrieveDashboardInstance: function(dashboardId,dashboardData){
            var instance = this._dashBoardsPool[dashboardId];
            if(instance){
                instance.setData(dashboardData);
            }else {
                instance = new Dashboard(dashboardData);
                this._dashBoardsPool[dashboardId] = instance;
            }

            return instance;
        },
        _search: function(dashboardId) {
            return this._dashBoardsPool[dashboardId];
        },
        _load: function(dashboardId){
            var thisDashboard = this;
            var deferred = $q.defer();
            $http.get(dashboardUrl+'/'+dashboardId+'.json?paging=false&fields=:all,dashboardItems[id,lastsUpdated,created,type,shape,chart[:all],reportTable[:all],map[id,lastUpdated,created,name,zoom,longitude,latitude,displayName,mapViews[:all],:all],:all,program[id,name],programStage[id,name],columns[dimension,filter,legendSet[id,name],items[id,name]],rows[dimension,filter,legendSet[id,name],items[id,name]],filters[dimension,filter,legendSet[id,name],items[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits]')
                .success(function(dashboardData){
                     var dashboard = thisDashboard._retrieveDashboardInstance(dashboardData.id,dashboardData);
                    deferred.resolve(dashboard);
                })
                .error(function(errorMessageData){
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
            $http.get(dashboardUrl +'.json?fields=:all,dashboardItems[id,lastsUpdated,created,type,shape,chart[:all],reportTable[:all],map[id,lastUpdated,created,name,zoom,longitude,latitude,displayName,mapViews[:all],:all],:all,program[id,name],programStage[id,name],columns[dimension,filter,legendSet[id,name],items[id,name]],rows[dimension,filter,legendSet[id,name],items[id,name]],filters[dimension,filter,legendSet[id,name],items[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits]')
                .success(function(dashboardsData){
                    var dashboards = [];
                    dashboardsData.dashboards.forEach(function(dashboardData){
                        // structure before persistance;
                        var dashboard = thisDashboard._retrieveDashboardInstance(dashboardData.id,dashboardData);
                        dashboards.push(dashboard);
                    });
                    deferred.resolve(dashboards);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },

        addDashboard: function(dashboardData) {
            var thisDashboard = this;
            var deferred = $q.defer();
            $http.post(dashboardUrl, dashboardData)
                .success(function(data, status, headers) {
                    //get dashboard id for the new dashboard
                    var dashboardId = headers('Location').split("/")[2];
                    //also add to the pool
                    thisDashboard._load(dashboardId)
                        .then(function(dashboard){
                            deferred.resolve(dashboardId)
                        },function(error){
                            deferred.reject(error)
                        });
                })
                .error(function(error) {
                    deferred.reject()
                });
            return deferred.promise;
        },
        deleteDashboard: function(dashboardId) {
            var thisDashboard = this;
            var deferred = $q.defer();
            $http.delete(dashboardUrl + '/' + dashboardId)
                .success(function(response){
                    //Delete also from the pool
                    delete thisDashboard._dashBoardsPool[dashboardId];
                    deferred.resolve(response);
                    console.log('dashboard deleted')
                })
                .error(function(error){
                    deferred.reject(error)
                    console.log('delete error' + error)
                })
            return deferred.promise;
        },
        updateDashboardName: function(dashboardData) {
            var thisDashboard = this;
            var deferred = $q.defer();
            $http.put(dashboardUrl + '/' + dashboardData.id, {name: dashboardData.name})
                .success(function(response) {
                    //also update dashboard pool
                    thisDashboard._load(dashboardData.id)
                        .then(function(dashboardData) {
                            deferred.resolve(response);
                        }, function(loadError) {
                                deferred.reject()
                            })
                })
                .error(function(updateError) {
                    deferred.reject()
                })
            return deferred.promise;
        },
        /* Update dashboard instance */
        setDashboard: function(dashboardData){
            var thisDashboardManager = this;
            var dashboard = this._search(dashboardData.id);
            if(dashboard) {
                dashboard.setData(dashboardData);
            }else {
                dashboard = thisDashboardManager._retrieveDashboardInstance(dashboardData);
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

mainServices.factory('dashboardItemsManager',['$http','$q','Dashboard','DashboardItem','DHIS2URL',function($http,$q,Dashboard,DashboardItem,DHIS2URL){

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
            $http.get('../../..'+'/api/dashboardItems/'+dashboardItemId+'.json?fields=id,lastsUpdated,created,type,shape,chart[:all],reportTable[:all],users[:identifiable],resources[:identifiable],reports[:identifiable],:all,program[id,name],programStage[id,name],columns[dimension,filter,legendSet[id,name],items[id,name]],rows[dimension,filter,legendSet[id,name],items[id,name]],filters[dimension,filter,legendSet[id,name],items[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits')
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
            $http.get(DHIS2URL+'/api/dashboardItems'+'.json?paging=false&fields=id,lastsUpdated,created,type,shape,chart[:all],reportTable[:all],users[:identifiable],resources[:identifiable],reports[:identifiable],:all,program[id,name],programStage[id,name],columns[dimension,filter,legendSet[id,name],items[id,name]],rows[dimension,filter,legendSet[id,name],items[id,name]],filters[dimension,filter,legendSet[id,name],items[id,name]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits')
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
            //Set set currentVisualization
            if(dashboardItemData.type=="CHART" || dashboardItemData.type=="EVENT_CHART") {
                dashboardItemData.currentVisualization='chart.'+angular.lowercase(dashboardItemData[this.formatEnumString(dashboardItemData.type)].type);
            }else if(dashboardItemData.type=="REPORT_TABLE" || dashboardItemData.type=='EVENT_REPORT') {
                dashboardItemData.currentVisualization='table';
            }else if (dashboardItemData.type=="MAP") {
                dashboardItemData.currentVisualization='map';
            }
            angular.extend(this, dashboardItemData);
        },
        formatEnumString: function(enumString){
            enumString = enumString.replace(/_/g,' ');
            enumString=enumString.toLowerCase();
            return enumString.substr(0,1)+enumString.replace(/(\b)([a-zA-Z])/g,
                    function(firstLetter){
                        return   firstLetter.toUpperCase();
                    }).replace(/ /g,'').substr(1);
        }
    };
    return DashboardItem;
});

mainServices.factory('userAccount', ['$http','$q',function($http, $q){
    var userAccount = {
        _username: '',
        getUsername: function() {
            var deferred = $q.defer();
            if(this._username != '') {
                deferred.resolve(this._username)
            } else {
                $http.get('../../../api/me/profile.json')
                    .success(function(account) {
                        deferred.resolve(account.username)
                    })
                    .error(function(error) {
                        deferred.reject(error)
                    });
            }
            return deferred.promise;
        }
    };

    return userAccount;
}])



