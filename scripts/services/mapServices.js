var mapServices = angular.module('mapServices',['ngResource']);

mapServices.factory('mapManager',['$http','shared',function($http,shared){
    'use strict';
var mapManager = {

    pushMapViews:function(analyticsObject){
        var mapId = analyticsObject.id;
        var url = "/api/maps/"+mapId+".json?fields=*,columns[dimension,filter,items[id,displayName|rename(name)]],rows[dimension,filter,items[id,displayName|rename(name)]],filters[dimension,filter,items[id,displayName|rename(name)]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit,mapViews[*,columns[dimension,filter,items[id,displayName|rename(name)]],rows[dimension,filter,items[id,displayName|rename(name)]],filters[dimension,filter,items[id,displayName|rename(name)]],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]&_dc=1455009241325";

       var promise = $http({
           method:'GET',
           url:url,
           dataType:'json',
           cache:true,
           isModified:true
       }).success(
           function(data){
           }
       );

        return promise;
    },
    prepareMapLayers:function(mapViews,organisationUnits,dimensionItems){
        var Layers = [];
        var layerType = "";
        var level = null;

        var geoUrl = "";
        var thematicUrl = "";
        var dimensionItems = "";
        var period = null;

            angular.forEach(mapViews,function(view){
            layerType = view.layer;
            level = view.parentLevel+1;

            if(layerType=="boundary"){
                var layer = {
                    name:'',
                    source: {
                        type: '',
                        geojson: {
                            object:''
                        }
                    }
                };
                if(view.rows){
                    var orgunitString = "";
                    angular.forEach(view.rows[0].items,function(item){
                        orgunitString+=item.id+";";
                    });
                    orgunitString = orgunitString.substring(0, orgunitString.length - 1);
                    //geoUrl = "/api/geoFeatures.json?ou=ou:LEVEL-"+level+";"+orgunitString;
                    geoUrl = "scripts/services/geoFeatures.json";


                }
            }

            if(layerType.indexOf('thematic')>=0){

                angular.forEach(view.dataDimensionItems,function(value){
                    if(value.dataDimensionItemType=="INDICATOR"){
                        dimensionItems+=value.indicator.id+";";
                    }

                });
                dimensionItems = dimensionItems.substring(0, dimensionItems.length - 1);

                angular.forEach(view.rows,function(value){
                    if(value.dimension=="ou"){
                        angular.forEach(value.items,function(valueOu){
                            organisationUnits+=valueOu.id+";";
                        });
                    }

                });
                organisationUnits = organisationUnits.substring(0, organisationUnits.length - 1);


                angular.forEach(view.filters,function(value){
                    if(value.dimension=="pe"){
                        var pes = "";
                        angular.forEach(value.items,function(valueP){
                            pes+=valueP.id+";";
                        });

                        period = pes.substring(0, pes.length - 1);
                    }
                });

            }



            });

        thematicUrl="../../analytics.jsonp?dimension=ou:"+dimensionItems+"&dimension=dx:"+dimensionItems+"&filter=pe:"+period+"&displayProperty=NAME&callback=Ext.data.JsonP.callback"
        var response = $.when(
        $http({
            method:'GET',
            url:thematicUrl,
            dataType:'json',
            cache:true,
            isModified:true
        }),$http({
            method:'GET',
            url:geoUrl,
            dataType:'json',
            cache:true,
            isModified:true
        })
        )
        return response;
    },
    getAnalytics:function(){},
    getGeoJson:function(data){


                var geoLayer = {"type":"FeatureCollection","features":[]};
                angular.forEach(data,function(value){
                    var feature = {
                        type:"GeoJSON",
                        id:"",
                        geometry:{
                            type:"",
                            coordinates:null
                        },
                        properties:{
                            code:"",
                            name:"",
                            level:"",
                            parent:"",
                            parentGraph:""
                        },style:{
                            fill:{
                                color:'rgba(0, 255, 0, 0.6)',
                                opacity:5
                            },
                            stroke:{
                                color:'white',
                                width:2
                            }
                        }
                    }

                        if(value.ty==2){
                            feature.type = "Feature";
                            feature.geometry.type = "MultiPolygon";

                            feature.geometry.coordinates    = value.co;
                            feature.properties.code         = null;
                            feature.properties.name         = value.na;
                            feature.properties.level        = value.le;
                            feature.properties.parent       = value.pi;
                            feature.properties.parentGraph  = value.pg;
                            feature.id  = value.id;
                            geoLayer.features.push(feature);
                        }




        });

        return geoLayer;
    },
    getShared:function(){
        return shared;
    }
};

    return mapManager;
}]);

mapServices.factory('shared',function(){
    var shared = {facility:0};
    return shared;

});

