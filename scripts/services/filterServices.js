  /**
 * Created by kelvin on 2/12/16.
 */
var filterService = angular.module('filterService',['ngResource']).constant('DHIS2URL', '../../..');

filterService.factory('filtersManager',['$q','$http',function($q,$http,DHIS) {
    'use strict';

    var filtersManager = {
        data: '',
        icons: [
            {name: 'table', image: 'table.jpg', action: ''},
            {name: 'bar', image: 'bar.png', action: ''},
            {name: 'line', image: 'line.png', action: ''},
            {name: 'combined', image: 'combined.jpg', action: ''},
            //{name: 'column', image: 'column.png', action: ''},
            {name: 'area', image: 'area.jpg', action: ''},
            {name: 'pie', image: 'pie.png', action: ''},
            {name: 'map', image: 'map.jpg', action: ''}
        ],
        getOrgUnits : function(){
            var self = this;
            var deferred = $q.defer();
            $http.get('../../..'+'/api/organisationUnits.json?filter=level:eq:1&paging=false&fields=id,name,children[id,name,children[id,name,children[id,name]]]')
                .success(function(orgunits){
                    deferred.resolve(orgunits);
                })
                .error(function(errorMessageData){
                    console.error(errorMessageData);
                    deferred.reject();
                });
            return deferred.promise;
        },

        getOtgunitTree : function(orgUnitArray){
            var orgUnitTree = [];
            angular.forEach(orgUnitArray.organisationUnits,function(value){
                var zoneRegions = [];
                angular.forEach(value.children,function(regions){
                    var regionDistricts = [];
                    angular.forEach(regions.children,function(district){
                        var districtsFacility = [];
                        angular.forEach(district.children,function(facility){
                            districtsFacility.push({name:facility.name,id:facility.id });
                        });
                        regionDistricts.push({name:district.name,id:district.id, children:districtsFacility });
                    });
                    zoneRegions.push({ name:regions.name,id:regions.id, children:regionDistricts });
                });
                orgUnitTree.push({ name:value.name,id:value.id, children:zoneRegions,selected:true });
            });
            return orgUnitTree;
        },

        getAnalyticsLink : function(orgunits,periods,data){
            var orgunitsArr = []; var ou;
            var periodsArr = [];  var pe;
            var dataArr = [];     var dx;
            //prepare orarganisation units
           angular.forEach(orgunits,function(value){
               orgunitsArr.push(value.id);
           });
            ou = orgunitsArr.join(';');
            //prepare periods
            angular.forEach(periods,function(value){
               periodsArr.push(value.id);
           });
            pe = periodsArr.join(';');
            //prepare data elements
            angular.forEach(data,function(value){
               dataArr.push(value);
            });
            dx = dataArr.join(';');

            var analytics = '../../..'+'/api/analytics.json?dimension=dx:'+dx+'&dimension=ou:'+ou+'&dimension=pe:'+pe+'&displayProperty=NAME';
            return analytics;
        },

        getPeriodArray: function(type,year){
        var periods = [];
        if(type == "Weekly"){
            periods.push({id:'',name:''})
        }if(type == "Monthly"){
            periods.push({id:year+'01',name:'January '+year},{id:year+'02',name:'February '+year},{id:year+'03',name:'March '+year},{id:year+'04',name:'April '+year},{id:year+'05',name:'May '+year},{id:year+'06',name:'June '+year},{id:year+'07',name:'July '+year},{id:year+'08',name:'August '+year},{id:year+'09',name:'September '+year},{id:year+'10',name:'October '+year},{id:year+'11',name:'November '+year},{id:year+'12',name:'December '+year})
        }if(type == "BiMonthly"){
            periods.push({id:year+'01B',name:'January - February '+year},{id:year+'02B',name:'March - April '+year},{id:year+'03B',name:'May - June '+year},{id:year+'04B',name:'July - August '+year},{id:year+'05B',name:'September - October '+year},{id:year+'06B',name:'November - December '+year})
        }if(type == "Quarterly"){
            periods.push({id:year+'Q1',name:'January - March '+year},{id:year+'Q2',name:'April - June '+year},{id:year+'Q3',name:'July - September '+year},{id:year+'Q4',name:'October - December '+year})
        }if(type == "SixMonthly"){
            periods.push({id:year+'S1',name:'January - June '+year},{id:year+'S2',name:'July - December '+year})
        }if(type == "SixMonthlyApril"){
            periods.push({id:year+'AprilS2',name:'October 2011 - March 2012'},{id:year+'AprilS1',name:'April - September '+year})
        }if(type == "FinancialOct"){
            for (var i = 0; i <= 10; i++) {
                var useYear = parseInt(year) - i;
                periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+useYear})
            }
        }if(type == "Yearly"){
            for (var i = 0; i <= 10; i++) {
                var useYear = parseInt(year) - i;
                if(i == 1){
                    periods.push({id:useYear,name:useYear,selected:true})
                }else{
                    periods.push({id:useYear,name:useYear})
                }

            }
        }if(type == "FinancialJuly"){
            for (var i = 0; i <= 10; i++) {
                var useYear = parseInt(year) - i;
                periods.push({id:useYear+'July',name:'July '+useYear+' - June '+useYear})
            }
        }if(type == "FinancialApril"){
            for (var i = 0; i <= 10; i++) {
                var useYear = parseInt(year) - i;
                periods.push({id:useYear+'April',name:'April '+useYear+' - March '+useYear})
            }
        }
        return periods;
    }
    };

    return filtersManager;
}]);