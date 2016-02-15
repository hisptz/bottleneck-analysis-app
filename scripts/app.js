
'use strict';

/* App Module */

var idashboard = angular.module('idashboard',
                    [
                        'ui.bootstrap',
                        'ngRoute','ui.date',
                        'ngCookies',
                        'ngSanitize',
                        'idashboardDirectives',
                        'idashboardControllers',
                        'idashboardServices',
                        'idashboardFilters',
                        'd2Services',
                        'd2Controllers',
                        'pascalprecht.translate',
                        'd2HeaderBar',
                        'mgcrea.ngStrap',
                        'ui.bootstrap',
                        'ivh.treeview',
                        'toaster',
                        'ngAnimate',
                        'angular-spinkit',
                        'angularjs-dropdown-multiselect',
                        'openlayers-directive',
                        'ngTable','multi-select-tree',
                        'highcharts-ng',
                        'angularUtils.directives.dirPagination'
                    ])
              
.value('DHIS2URL', '../../..')
.config(function($translateProvider,$routeProvider,ivhTreeviewOptionsProvider) {
	ivhTreeviewOptionsProvider.set({
		   defaultSelectedState: false,
		   validate: false,
		   twistieCollapsedTpl: '<span class="glyphicon glyphicon-plus"></span>',
		   twistieExpandedTpl: '<span class="glyphicon glyphicon-minus"></span>',
		   twistieLeafTpl: '&#9679;'
		 });
	$routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    }).when('/dashboards/:dashboardid/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController'
    }).otherwise({
        redirectTo : '/'
    });
     
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});
