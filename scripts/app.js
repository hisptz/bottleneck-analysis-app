
'use strict';

/* App Module */

var idashboard = angular.module('idashboard',
                    [
                        'ui.bootstrap',
                        'ngRoute',
                        'ui.date',
                        'ngCookies',
                        'ngSanitize',
                        'idashboardDirectives',
                        'idashboardControllers',
                        'idashboardServices',
                        'idashboardFilters',
                        'd2Services',
                        'd2Controllers',
                        'd2HeaderBar',
                        'mgcrea.ngStrap',
                        'pascalprecht.translate',
                        'ui.bootstrap',
                        'toaster',
                        'ngAnimate',
                        'angular-spinkit',
                        'openlayers-directive',
                        'multi-select-tree',
                        'highcharts-ng',
                        'angularUtils.directives.dirPagination'
                    ])
              
.value('DHIS2URL', '../../..')
.config(function($translateProvider,$routeProvider,$popoverProvider) {
        angular.extend($popoverProvider.defaults, {
            animation: 'am-flip-x',
            trigger: 'hover'
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
