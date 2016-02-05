var mapServices = angular.module('mapServices',['ngResource']);

mapServices.factory('mapManager',['$http','shared',function($http,shared){
    'use strict';
var mapManager = {};

    return mapManager;
}]);

mapServices.factory('shared',function(){
    var shared = {facility:0};
    return shared;

});

