var mapServices = angular.module('mapServices',['ngResource']);

mapServices.factory('mapManager',['$http','olData','olHelpers','shared',function($http,olData,olHelpers,shared){
    'use strict';
var mapManager = {
    geoLayer:{},
    features:{},
    organisationUnits:"",
    boundaryLayer:{},
    thematicLayers:[],
    thematicDx:{},
    analyticsObject:{},
    period:null,
    legendSet:{legend:{}},
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
    getMapLayerBoundaries:function(organisationUnits){
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
                           feature.id  = value.id;
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
    console.log(mapManager.thematicLayers);
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
                       mapManager.analyticsObject = data.rows;
                   }
               );

                return promise;

        }

    },
    renderMapLayers:function(mapCenter){
        mapManager.legendSet.legend = {};
    var layer = mapManager.thematicLayers[0];
                      var colorArray = mapManager.getColorArray(layer.colorLow,layer.colorHigh,layer.classes);
                      var valueIntervals = mapManager.getValueInterval(mapManager.analyticsObject,layer.classes);
                      var legend = mapManager.getLegend(colorArray,valueIntervals);
                      mapManager.legendSet.legend = legend;
                      angular.forEach(mapManager.analyticsObject,function(value,index){
                          var    layerOpacity = layer.opacity;
                          mapManager.features[value[1]] = {
                                  facility_id:value[1],
                                  opacity:layerOpacity,
                                  "color":mapManager.decideColor(value,legend),
                                  "facility":Math.floor(Math.random() * 256)
                                        };

                      });



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
                    layers: [ 'mousemove', 'click']
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
    registerMapEvents:function(scope){
        olData.getMap().then(function(map) {
            var previousFeature;
            var overlay = new ol.Overlay({
                element: document.getElementById('districtbox'),
                positioning: 'top-right',
                offset: [100, -100],
                position: [100, -100]
            });
            var overlayHidden = true;
            // Mouse click function, called from the Leaflet Map Events
            scope.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {
                scope.$apply(function(scope) {

                    //$scope.selectedDistrictHover = feature ? mapService.features[feature.getId()] : '';
                    //if(feature) {
                    //    $scope.selectedDistrictHover = feature ? mapService.features[feature.getId()] : '';
                    //}
                    //console.log(feature);

                });

                //if (!feature) {
                //    $scope.selectedDistrictHover = null;
                //    map.removeOverlay(overlay);
                //    overlayHidden = true;
                //    return;
                //} else if (overlayHidden) {
                //    map.addOverlay(overlay);
                //    overlayHidden = false;
                //}
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
            });

            scope.$on('openlayers.layers.geojson.click', function(event, feature, olEvent) {

                scope.$apply(function(scope) {
                    console.log(feature);
                    //$scope.selectedDistrict = feature ? mapService.features[feature.getId()] : '';
                    //if(feature) {
                    //    // looping throught indicator types
                    //    $scope.selectedDistrict = feature ? mapService.features[feature.getId()] : '';
                    //
                    //    $scope.treeWithSelectedDistrict(feature.getId());
                    //    var indicators = [
                    //        {id:"zIAxcoxZ3Pl",name:"EAC: BCG dose given under one year"},
                    //        {id:"Y1pkrlq2hWi",name:"Infant Mortality Rate"},
                    //        {id:"BlZrj2FC6bG",name:"Neonatal Mortality Rate"},
                    //        {id:"WhsP7nsuwnz",name:"PENTA 3 vaccination coverage children under 1 year"},
                    //        {id:"TvgyTWvJamX",name:"Proportion of pregnant mothers who received 2 doses IPT"},
                    //        {id:"TdxVgoa08tn",name:"ANC HIV prevalence (15-24 years)"},
                    //        {id:"sxBx8Bone59",name:"OPD Attendance per capita"},
                    //        {id:"uOOJi6b0pzm",name:"Low birth weight among new-borns"},
                    //        {id:"heyJnpx5b37",name:"OPV 3 Vaccination Coverage"},
                    //        {id:"qHpMHX3KWZn",name:"Proportion of laboratory confirmed malaria cases among all OPD visits"},
                    //        {id:"z9ispsHeYNw",name:"Malaria Death Rate <5"},
                    //        {id:"ohw1MBklYkc",name:"PlanRep Implemented Skilled Human Resources Recruited"}
                    //    ]
                    //    $scope.selectedDistrictName = $scope.selectedDistrict.name;
                    //}
                });

                if (!feature) {
                    map.removeOverlay(overlay);
                    overlayHidden = true;
                    return;
                } else if (overlayHidden) {
                    map.addOverlay(overlay);
                    overlayHidden = false;
                }
                overlay.setPosition(map.getEventCoordinate(olEvent));

                //if (feature) {
                //    feature.setStyle(olHelpers.createStyle({
                //        fill: {
                //            color:mapService.features[feature.getId()].color,
                //            opacity:0.5
                //        }
                //    }));
                //    if (previousFeature && feature !== previousFeature) {
                //        previousFeature.setStyle(getStyle(previousFeature));
                //    }
                //    previousFeature = feature;
                //}
            });

            scope.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {
                scope.$apply(function($scope) {
                    //if(feature) {
                    //    $scope.id = feature.getId();
                    //    $scope.selectedDistrict = feature ? mapService.features[feature.getId()]: '';
                    //}

                    //console.log(feature);
                });

            });


        });
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

