/**
 * Created by mahane on 12/18/15.
 */
var tableServices = angular.module('tableServices',['ngResource']);

mainServices.factory("TableRenderer",function($http,DHIS2URL){
    var dataElementArray=dx.split(";");
    var orgUnitArray=[];
    var prepareTableHeaders=[];
    var allData=[];
    $http.get(DHIS2URL+'/api/analytics.json?dimension=dx:'+dx+'&dimension=ou:LEVEL-2;'+'&filter=pe:'+'&displayProperty=NAME')
        .success(function(analyticsResultData){
            function tableOperation(analyticsResultData){
                for(var i=0;i<dataElementArray.length;i++){
                    prepareTableHeaders.push({"uid":dataElementArray[i],"name":metaData.metaData.names[dataElementArray[i]]})
                }
                angular.forEach(metaData.metaData.ou,function(value){
                    allData.push({"orGunit":metaData.metaData.names[value],"orgUnitId":value});
                })
                angular.forEach(allData,function(value){
                    var dataElement = [];
                    angular.forEach(prepareTableHeaders,function(headers){
                        angular.forEach(metaData.rows,function(val){
                            if(value.orgUnitId==val[1] && val[0]== headers.uid){
                                dataElement.push({"name":headers.name,"uid":headers.uid,"value":val[2]})
                            }
                        });
                    });
                    orgUnitArray.push({"name":value.orGunit,'uid':value.orgUnitId,'dataElement':dataElement});
                });
                console.log(orgUnitArray);
                console.log(prepareTableHeaders);
            }
            return tableOperation();

        }).error(function(analyticErrorMessage){

        });


});

