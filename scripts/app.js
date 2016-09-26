
'use strict';

/* App Module */

var idashboard = angular.module('idashboard',
                    [
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
                        'toaster',
                        'ngAnimate',
                        'angular-spinkit',
                        'openlayers-directive',
                        'multi-select-tree',
                        'highcharts-ng',
                        'angularUtils.directives.dirPagination',
                        'dndLists',
                        'ngCsv',
                        'ngScrollbar',
                        'ui.multiselect',
                        'ngAnimate',
                        'ngStorage',
                        'mgcrea.ngStrap',
                        'leaflet-directive'
                    ])
.config(['$localStorageProvider',
function ($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('dhis2.');
    var dashboardSerializer = function (value) {
        // Do what you want with the value.
        return value;
    };

    var dashboardDeserializer = function (value) {
        return value;
    };

    $localStorageProvider.setSerializer(dashboardSerializer);
    $localStorageProvider.setDeserializer(dashboardDeserializer);

}])
              
.value('DHIS2URL', '../../..')
.value('MAP_TOKEN','pk.eyJ1Ijoia2VsdmlubWJ3aWxvIiwiYSI6ImNpc2xrcmZsbzAwN2oyeXJueHVlOGZ0MzAifQ.GkRBoG6qFXrMdQgSkw6wJg')
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


})
.filter('capitalize', function() {
    return function filter(input) {
        if (input !== null) {
            return input.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    }
})
.filter('underscoreless', function() {
        return function (input) {
            return input.replace(/_/g, ' ');
        };
});