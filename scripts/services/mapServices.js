var mapServices = angular.module('mapServices',['ngResource']);

mapServices.factory('mapManager',['$http','olHelpers','shared',function($http,olHelpers,shared){
    'use strict';
var mapManager = {
    features:[],
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
    prepareMapLayers:function(mapViews,orgunitChildren,dimensionItems){
        var Layers = [];
        var layerType = "";
        var level = null;

        var geoUrl = "";
        var thematicUrl = "";
        var dimensionItems = "";
        var period = null;
        var thematicOrganisationUnits = "";
            angular.forEach(mapViews,function(view){
            layerType = view.layer;
            level = view.parentLevel+2;

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
                    var count_user_orgunit = 0;
                    angular.forEach(view.rows[0].items,function(item){
                        if((item.id=="USER_ORGUNIT"||item.id=="USER_ORGUNIT_CHILDREN")&&count_user_orgunit==0) {

                            angular.forEach(orgunitChildren, function (children) {
                                orgunitString += children.id + ";";
                            });

                        }

                    });
                    orgunitString = orgunitString.substring(0, orgunitString.length - 1);
                    geoUrl = "/api/geoFeatures.json?ou=ou:LEVEL-"+level+";"+orgunitString;


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
                            if((valueOu.id=="USER_ORGUNIT"||valueOu.id=="USER_ORGUNIT_CHILDREN")&&count_user_orgunit==0){
                                count_user_orgunit++;

                                    angular.forEach(orgunitChildren,function(children){
                                        thematicOrganisationUnits+=children.id+";";
                                    });


                            }

                            if(valueOu.id!="USER_ORGUNIT_CHILDREN"&&valueOu.id!="USER_ORGUNIT"){
                                thematicOrganisationUnits+=valueOu.id+";";
                            }


                        });
                    }


                });
                thematicOrganisationUnits = thematicOrganisationUnits.substring(0, thematicOrganisationUnits.length - 1);


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

        thematicUrl="../../analytics.json?dimension=ou:"+thematicOrganisationUnits+"&dimension=dx:"+dimensionItems+"&filter=pe:"+period+"&displayProperty=NAME"
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
    getLayerProperties:function(mapViews){
        var properties = [];


        angular.forEach(mapViews,function(value){
            var layers = {};
            if(value.layer.indexOf('thematic')>=0){

                layers.type = value.layer;
                layers.name = value.name;
                layers.ishidden = value.hidden;
                layers.showLlabel = value.labels;
                layers.label = {};
                layers.label.labelFontSize = value.labelFontSize;
                layers.label.labelFontStyle = value.labelFontStyle;
                layers.label.labelFontWeight = value.labelFontWeight;
                layers.opacity = value.opacity;
                layers.classes = value.classes;
                layers.colorHigh = value.colorHigh;
                layers.colorLow = value.colorLow;
                properties.push(layers);
            }

            if(value.layer.indexOf('boundary')>=0){
                layers.type = value.layer;
                layers.name = value.name;
                layers.ishidden = value.hidden;
                layers.showLlabel = value.labels;
                layers.label = {};
                layers.label.labelFontSize = value.labelFontSize;
                layers.label.labelFontStyle = value.labelFontStyle;
                properties.push(layers);
            }

        });

        return properties;
    },
    getGeoJson:function(data,thematicData,layerProperties,props){
                var legend = null;
                var geoLayer = {"type":"FeatureCollection","features":[]};
        var colorHigh = "";
                var layerOpacity = 0;
                angular.forEach(layerProperties,function(layer){
                    if(layer.type.indexOf("thematic")>=0){

                        var colorArray = mapManager.getColorArray(layer.colorLow,layer.colorHigh,layer.classes);
                        var valueIntervals = mapManager.getValueInterval(thematicData.rows,layer.classes);
                        legend = mapManager.getLegend(colorArray,valueIntervals);

                        angular.forEach(thematicData.rows,function(value,index){
                            layerOpacity = layer.opacity;
                            mapManager.features[value[1]] = {
                                facility_id:value[1],
                                opacity:layerOpacity,
                                "color":mapManager.decideColor(value,legend),
                                "facility":Math.floor(Math.random() * 256)
                            };

                        });

                    }
                });
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
                        },style:""
                    }

                        if(value.ty==2){
                            feature.type = "Feature";
                            feature.geometry.type = "MultiPolygon";

                            feature.geometry.coordinates    = JSON.parse(value.co);
                            feature.properties.code         = null;
                            feature.properties.name         = value.na;
                            feature.properties.level        = value.le;
                            feature.properties.parent       = value.pi;
                            feature.properties.parentGraph  = value.pg;
                            feature.id  = value.id;
                            feature.style  = mapManager.getStyle(feature);
                            geoLayer.features.push(feature);
                        }




        });

       var boundaries =  {
            Africa: {
                zoom: props.zoom,
                    lat: props.latitude,
                    lon: props.longitude
            },
            layers:[
                {
                    name:'OpenStreetMap',
                    source: {
                        type: 'OSM',
                        url:"http://tile.openstreetmap.org/#map=" + props.zoom + "/" + props.longitude + "/" + props.latitude
                    }
                } ,
                {
                    name:'geojson',
                    visible: true,
                    opacity:layerOpacity,
                    source: {
                        type: 'GeoJSON',
                        geojson: {
                            object: geoLayer
                        }
                    },
                    style: mapManager.getStyle
                }
            ],
                defaults: {
            events: {
                layers: [ 'mousemove', 'click']
            }
        }
        }
        return boundaries;
    },
    getShared:function(){
        return shared;
    },
    getUserOrgunit:function(){
            var response = $http({
                method:'GET',
                url:'/api/me/organisationUnits.json',
                dataType:'json',
                cache:true,
                isModified:true
            });

        return response;
    },
    getColorArray:function(low,high,interval){
        var startColor = new mapfish.ColorRgb(),
            endColor = new mapfish.ColorRgb()
        startColor.setFromHex(low);
        endColor.setFromHex(high);
        var colors = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(startColor, endColor, interval);
        var resultArray = [];
        angular.forEach(colors,function(value,index){
            resultArray.push({class:index,color:value.toHexString()});
        })

        return resultArray;
    },
    getStyle:function(feature){
        var color = "";
        var featureId = "";

        if(feature.id){
            featureId =feature.id;

        }else{
            featureId = feature.getId();
        }
            color = mapManager.features[featureId].color;

        var style = olHelpers.createStyle({
            fill:{
                color:color,
                opacity:mapManager.features[featureId].opacity
            },
            stroke:{
                color:'#cccccc',
                width:1
            },
            text:  new ol.style.Text({
                textAlign: 'center',
                textBaseline: 'middle',
                font: 'Arial',
                //text: formatText(districtProperties[feature.getId()].name),
                fill: new ol.style.Fill({color: "#000000"}),
                stroke: new ol.style.Stroke({color: "#cccccc", width: 1}),
                offsetX: 0,
                offsetY: 0,
                rotation: 0
            })
        });
        return [ style ];

    },
    getValueInterval:function(rows,classes){
        var valueArray = []
        angular.forEach(rows,function(value,index){
            valueArray.push(Number(value[2]));
        });
        valueArray.sort(function(a, b){return a-b});
        var interval = ((valueArray[valueArray.length-1]-valueArray[0])/classes).toFixed(1);

        var start = valueArray[0];
        var end = valueArray[valueArray.length-1];
            var p=0;
        var legendsClass = [];
        while(p<classes){
            legendsClass.push({id:p,color:"#",interval:start+" - "+(Number(start)+Number(interval)).toFixed(1)});
            start= (Number(start)+Number(interval)).toFixed(1);
            p++;
        }

        return legendsClass;
    },
    getLegend:function(colorArray,valueIntervals){
        angular.forEach(colorArray,function(value,index){
            valueIntervals[index].color = value.color;
        });

        return valueIntervals;
    },
    decideColor:function(objects,legend){
        var color = "";
        var indicatorValue = objects[2];
        angular.forEach(legend,function(value,index){

            var interval = (value.interval).split(" - ");
                if(Number(interval[0])<=indicatorValue&&indicatorValue<interval[1]){
                    color    = value.color;
                }
        });

        return color;
    }
};

    return mapManager;
}]);

mapServices.factory('shared',function(){
    var shared = {facility:0};
    return shared;

});

