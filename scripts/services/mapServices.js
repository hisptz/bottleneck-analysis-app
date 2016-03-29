var mapServices = angular.module('mapServices',['ngResource']);

mapServices.factory('mapManager',['$http','$rootScope','olData','olHelpers','shared',function($http,$rootScope,olData,olHelpers,shared){
    'use strict';
var mapManager = {
    geoLayer:{},
    features:{},
    featuredData:{},
    touchFeature:{},
    organisationUnits:"",
    boundaryLayer:{},
    thematicLayers:[],
    thematicDx:{},
    analyticsObject:{},
    analytics:{},
    period:null,
    legendSet:{legend:{}},
    dasboardId:null,
    getOrganisationUnits:function(){
        var thematicLayerOne = mapManager.thematicLayers[0]
        mapManager.getPeriod(thematicLayerOne);
            var orgs = "";
        if(thematicLayerOne.rows){
            angular.forEach(thematicLayerOne.rows,function(rowValue){
                if(rowValue.dimension=="ou"){
                    angular.forEach(rowValue.items,function(itemValue){
                        orgs += itemValue.id+";";
                    });
                }
            });

                mapManager.organisationUnits = orgs.substring(0, orgs.length - 1);

        }
    },
    getPeriod:function(output){
            var period = "";
        angular.forEach(output.filters,function(periodValue){
                angular.forEach(periodValue.items,function(value,index){
                            period += value.id+";";
                });
        });
            if(period.length>0){
                mapManager.period = period.substring(0, period.length - 1);
            }
    },
    separateLayers:function(output){
        mapManager.boundaryLayer = {};
        mapManager.thematicLayers = [];
        var mapLayers  = output.mapViews;

        angular.forEach(mapLayers,function(value){
            if(typeof value !="undefined"){
                if(value.layer=="boundary"){
                    mapManager.boundaryLayer = value;
                }else{
                    mapManager.thematicLayers.push(value);
                }
            }
        });
    },
    getDimensions:function(dataDimensionItems){
        var dimensionType = dataDimensionItems.dataDimensionItemType;

        if(dimensionType=="INDICATOR"){
            return dataDimensionItems.indicator.id;
        }else if(dimensionType=="AGGREGATE_DATA_ELEMENT"){
            return dataDimensionItems.dataElement.id;
        }
    },
    getMapLayerBoundaries:function(organisationUnits,dashboardId){
        var geoLayer = {"type":"FeatureCollection","features":[]};
            var url = "../../../api/geoFeatures.json?ou=ou:"+organisationUnits;

           var promise = $http({
               method:'GET',
               url:url,
               dataType:'json',
               cache:true,
               isModified:true
           }).success(
               function(data){
               angular.forEach(data,function(value){

                   if(value.na.indexOf("MOH - Tanzania")<0){
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
                           feature.id  = value.id+"_"+dashboardId;
                           feature.style  = null;//mapManager.getStyle(feature);
                           geoLayer.features.push(feature);
                       }



                   }


                       });
                   mapManager.geoLayer = geoLayer;
               }
           );

            return promise;
    },
    getMapThematicData:function(){

        // use one thematic layer to render colors on map regions
        if(mapManager.thematicLayers.length>0){

            var thematicLayer = mapManager.thematicLayers[0];
            mapManager.thematicDx.name = thematicLayer.displayName;
            mapManager.thematicDx.id = mapManager.getDimensions(thematicLayer.dataDimensionItems[0]);

            mapManager.getOrganisationUnits(thematicLayer);

        var analyticsUrl = "../../../api/analytics.json?dimension=ou:"+mapManager.organisationUnits+"&dimension=dx:"+mapManager.thematicDx.id+"&filter=pe:"+mapManager.period+"&displayProperty=NAME";
            mapManager.analyticsObject = {};

               var promise = $http({
                   method:'GET',
                   url:analyticsUrl,
                   dataType:'json',
                   cache:true,
                   isModified:true
               }).success(
                   function(data){
                       mapManager.analytics = data;
                       mapManager.analyticsObject = data.rows;
                   }
               );

                return promise;

        }

    },
    renderMapLayers:function(mapCenter,dashboardItem_id){
        mapManager.legendSet.legend = {};
        mapManager.dasboardId = dashboardItem_id;
    var layer = mapManager.thematicLayers[0];
                      var colorArray = mapManager.getColorArray(layer.colorLow,layer.colorHigh,layer.classes);
                      var valueIntervals = mapManager.getValueInterval(mapManager.analyticsObject,layer.classes);
                      var legend = mapManager.getLegend(colorArray,valueIntervals);
                      mapManager.legendSet.legend = legend;
                      angular.forEach(mapManager.analyticsObject,function(value,index){
                          mapManager.featuredData[value[1]+"_"+dashboardItem_id]= {name:mapManager.analytics.metaData.names[value[1]],value:value[2]};
                          var    layerOpacity = layer.opacity;
                          mapManager.features[value[1]+"_"+dashboardItem_id] = {
                                  dashboard:dashboardItem_id,
                                  facility_id:value[1],
                                  opacity:layerOpacity,
                                  "color":mapManager.decideColor(value,legend),
                                  "facility":Math.floor(Math.random() * 256)
                                        };

                      });
                        // locally store data item
                        localStorage.removeItem(dashboardItem_id);
                        localStorage.setItem(dashboardItem_id,JSON.stringify(mapManager.featuredData));


           var boundaries =  {
                MapCenter: mapCenter,
                layers:[
                    {
                        "name": "OpenCycleMap",
                        "active": true,
                        "source": {
                            "type": "OSM",
                            "url": "http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                            "attribution": "All maps &copy; <a href=\"http://www.opencyclemap.org/\">OpenCycleMap</a>"
                        },
                        "visible": true,
                        "opacity": 1
                    }
                    ,
                    {
                        name:'geojson',
                        visible: true,
                        opacity:8,
                        source: {
                            type: 'GeoJSON',
                            geojson: {
                                object: mapManager.geoLayer
                            }
                        },
                        style: mapManager.getStyle
                    }
                ],
                    defaults: {
                events: {
                    layers: [ 'mousemove', 'click', 'featuresadded']
                }
            }
            }
            return boundaries;
    },
    getLayerProperties:function(value){

            var layers = {};

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



        return layers;
    },
    getShared:function(){
        return shared;
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
        var opacity = 0.8;
        var featureId = "";
        if(feature.id){
            featureId =feature.id;

        }else{
            featureId = feature.getId();
        }

        if(mapManager.features[featureId]){
            color = mapManager.features[featureId].color;
        }

        if(mapManager.features[featureId]){
            mapManager.features[featureId].opacity;
        }


        var style = olHelpers.createStyle({
            fill:{
                color:color,
                opacity:opacity
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
        var interval = ((valueArray[valueArray.length-1]-valueArray[0])/classes).toFixed(0);

        var start = valueArray[0];
        var end = valueArray[valueArray.length-1];
            var p=0;
        var legendsClass = [];
        while(p<classes){
            legendsClass.push({id:p,color:"#",interval:start+" - "+(Number(start)+Number(interval)).toFixed(0)});
            start= (Number(start)+Number(interval)).toFixed(0);
            p++;
        }

        return legendsClass;
    },
    getLegend:function(colorArray,valueIntervals){
        angular.forEach(colorArray,function(value,index){
            valueIntervals[index].color = value.color;
            valueIntervals[index].count = 0;
        });

        return valueIntervals;
    },
    decideColor:function(objects,legend){
        var color = "";
        var indicatorValue = toDecimal(objects[2]);
        angular.forEach(legend,function(value,index){

            var interval = (value.interval).split(" - ");
                if(Number(interval[0])<=Number(indicatorValue)&&Number(indicatorValue)<Number(interval[1])){
                    color    = value.color;
                    mapManager.legendSet.legend[index].count+=1;
                }
        });

        return color;
    },
    prepareMapProperties:function(chartObject){

        if(chartObject['chart']!=null){
            mapManager.collectDataFromChartObject(chartObject);
        }
        if(chartObject['reportTable']!=null){
            mapManager.collectDataFromTableObject(chartObject);
        }
    },
    collectDataFromTableObject:function(chartObject){
        mapManager.thematicLayers = [];
        var dataObject = chartObject.object;
        var periods = chartObject.dataperiods;


        mapManager.period = periods[0].id; //TODO this has to be chacked against emptyness of array periods
        var refinedObject = {};
        refinedObject.id = dataObject.id;
        refinedObject.name = dataObject.displayName;
        refinedObject.dataDimensionItems = dataObject.dataDimensionItems; // TODO create a mechanism to change data dimension items
        refinedObject.rows = [];
        refinedObject.filters = [];
        angular.forEach(dataObject.filters,function(filterValue,filterIndex){
            if(filterValue.dimension=="ou"){
                refinedObject.rows.push(filterValue)
            }

            if(filterValue.dimension=="pe"){
                refinedObject.filters.push(filterValue)
            }

            if(refinedObject.rows.length==1){
                if(refinedObject.rows[0].items[0].id=="m0frOspS7JY"){ // TODO remove the hard coding of org unit id
                    refinedObject.rows[0].items.push({id:"LEVEL-2"});
                }
            }

        });

        angular.forEach(dataObject.rows,function(rowsValue,rowsIndex){
            if(rowsValue.dimension=="ou"){
                refinedObject.rows.push(rowsValue)
            }

            if(rowsValue.dimension=="pe"){
                refinedObject.filters.push(rowsValue)
            }
        });

        /// prepare periods
        var pe = "";
        angular.forEach(refinedObject.rows[0].items,function(periodValue,periodIndex){
            pe+=periodValue.id+";"
        });
        mapManager.organisationUnits = pe.substring(0,pe.length-1);
        mapManager.thematicLayers.push(mapManager.prepareFalseThematicLayer(refinedObject));
    },
    collectDataFromChartObject:function(chartObject){
        mapManager.thematicLayers = [];
        var dataObject = chartObject.object;
        var periods = chartObject.dataperiods;


        mapManager.period = periods[0].id; //TODO this has to be chacked against emptyness of array periods
        var refinedObject = {};
        refinedObject.id = dataObject.id;
        refinedObject.name = dataObject.displayName;
        refinedObject.dataDimensionItems = dataObject.dataDimensionItems; // TODO create a mechanism to change data dimension items
        refinedObject.rows = [];
        refinedObject.filters = [];
        angular.forEach(dataObject.filters,function(filterValue,filterIndex){
            if(filterValue.dimension=="ou"){
                refinedObject.rows.push(filterValue)
            }

            if(filterValue.dimension=="pe"){
                refinedObject.filters.push(filterValue)
            }

            if(refinedObject.rows.length==1){
                if(refinedObject.rows[0].items[0].id=="m0frOspS7JY"){ // TODO remove the hard coding of org unit id
                    refinedObject.rows[0].items.push({id:"LEVEL-2"});
                }
            }

        });

        angular.forEach(dataObject.rows,function(rowsValue,rowsIndex){
            if(rowsValue.dimension=="ou"){
                refinedObject.rows.push(rowsValue)
            }

            if(rowsValue.dimension=="pe"){
                refinedObject.filters.push(rowsValue)
            }
        });

        /// prepare periods
        var pe = "";
        angular.forEach(refinedObject.rows[0].items,function(periodValue,periodIndex){
            pe+=periodValue.id+";"
        });
        mapManager.organisationUnits = pe.substring(0,pe.length-1);
        mapManager.thematicLayers.push(mapManager.prepareFalseThematicLayer(refinedObject));
    },
    prepareFalseThematicLayer:function(refinedObject){
        var falseThematic = {
            "id": refinedObject.id,
            "name": refinedObject.name,
            "parentLevel": 0,
            "method": 3,
            "labelFontSize": "11px",
            "colorHigh": "00FF00",
            "completedOnly": false,
            "labels": false,
            "hidden": false,
            "displayName": "",
            "classes": 5,
            "labelFontColor": "#000000",
            "layer": "thematic1",
            "labelFontStyle": "normal",
            "labelFontWeight": "normal",
            "radiusLow": 5,
            "radiusHigh": 15,
            "colorLow": "FF0000",
            "opacity": 0.8,
            "attributeDimensions": [],
            "programIndicatorDimensions": [],
            "attributeValues": [],
            "dataDimensionItems":refinedObject.dataDimensionItems,
            //"columns": [
            //    {
            //        "dimension": "dx",
            //        "items": [
            //            {
            //                "id": "TRoamv0YPt3"
            //            }
            //        ]
            //    }
            //],
            "dataElementDimensions": [],
            "categoryDimensions": [],
            "filters":refinedObject.filters,
            "rows":refinedObject.rows,
            "categoryOptionGroups": []
        }

        return falseThematic;
    },
    registerMapEvents:function(scope,dashboardId,callBack){
        olData.getMap().then(function(map) {
            var previousFeature;
            var overlay = new ol.Overlay({
                element: document.getElementById('tootip_'+dashboardId),
                positioning: 'top-center',
                offset: [100, -100],
                position: [100, -100]
            });
            var overlayHidden = true;
            // Mouse click function, called from the Leaflet Map Events
            scope.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {
                scope.$apply(function(scope) {
                    scope.previousFeature = feature.getId();
                    var dashboardId = scope.previousFeature.split("_")[1];
                    $rootScope.$broadcast('trackDashboard', dashboardId);

                });

                if (!feature) {
                    map.removeOverlay(overlay);
                    overlayHidden = true;
                    return;
                } else if (overlayHidden) {
                    map.addOverlay(overlay);
                    overlayHidden = false;
                }

                //overlay.setPosition(map.getEventCoordinate(olEvent));
                //if (feature) {
                //    feature.setStyle(olHelpers.createStyle({
                //        fill: {
                //            color: mapService.features[feature.getId()].color,
                //            opacity:0.4
                //        },
                //        stroke: {
                //            color: '#A3CEC5',
                //            width:2
                //
                //        }
                //    }));
                //    if (previousFeature && feature !== previousFeature) {
                //        previousFeature.setStyle(mapService.getStyle(previousFeature));
                //    }
                //    previousFeature = feature;
                //}

                callBack(scope);
            });

            scope.$on('openlayers.layers.geojson.click', function(event, feature, olEvent) {

                // TODO Handle events after click of the map layer
            });

            scope.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {
                scope.$apply(function($scope) {
                });

            });


        });

    },
    setTouchFeature:function(dashboardId){
        localStorage.setItem(dashboardId,JSON.stringify(mapManager.thematicLayers[0]));
    }

};

    return mapManager;

    function toDecimal(base){

        if(base.indexOf("E")>=0){
            mapManager.organisationUnits = base.substring(0, base.indexOf("E"));
            var exponent = Number(base.substr(base.indexOf("E"),base.length-1));
            var newbase = Number(base.substring(0, base.indexOf("E")))*Math.pow(10,exponent);

            base = newbase;
        }

        return base;
    }
}]);

mapServices.factory('shared',function(){
    var shared = {facility:0};
    return shared;

});

