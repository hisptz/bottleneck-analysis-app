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
    originalAnalytics:{},
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
    getOrganisationUnitsFromTree:function(treeOrgUnits){
            var orgs = "";
        angular.forEach(treeOrgUnits,function(orgUnitItem,orgUntIndex){
            if(orgUnitItem.name.indexOf("Tanzania")>=0){
                orgs+=orgUnitItem.id+";LEVEL-2;";
            }else{
                orgs+=orgUnitItem.id+";";
            }

        });
                mapManager.organisationUnits = orgs.substring(0, orgs.length - 1);


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

    //getAnalyticsUrl:function()
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
    },
    getOriginalAnalytics:function(dashboard){
        dashboard = dashboard+"_analytics";
        return JSON.parse(localStorage.getItem(dashboard));
    },
    setOriginalAnalytics:function(analytics,dashboard){
        dashboard = dashboard+"_analytics";
        mapManager.originalAnalytics = analytics;
        localStorage.setItem(dashboard,JSON.stringify(analytics));
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

(function() {
    window.mapfish = {

        /**
         * Property: _scriptName
         * {String} Relative path of this script.
         */
        _scriptName: "MapFish.js",

        /**
         * Function: _getScriptLocation
         * Return the path to this script.
         *
         * Returns:
         * Path to this script
         */
        _getScriptLocation: function() {
            // Workaround for Firefox bug:
            // https://bugzilla.mozilla.org/show_bug.cgi?id=351282
            if (window.gMfLocation) {
                return window.gMfLocation;
            }

            var scriptLocation = "";
            var scriptName = mapfish._scriptName;

            var scripts = document.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
                    var index = src.lastIndexOf(scriptName);
                    // is it found, at the end of the URL?
                    if ((index > -1) && (index + scriptName.length == src.length)) {
                        scriptLocation = src.slice(0, -scriptName.length);
                        break;
                    }
                }
            }
            return scriptLocation;
        }
    };

    // MAPFISH COLOR (color.js)

    /**
     * An abstract representation of color.
     */
    mapfish.Color = OpenLayers.Class({
        getColorRgb: function() {}
    });

    /**
     * Class: mapfish.ColorRgb
     * Class for representing RGB colors.
     */
    mapfish.ColorRgb = OpenLayers.Class(mapfish.Color, {
        redLevel: null,
        greenLevel: null,
        blueLevel: null,

        /**
         * Constructor: mapfish.ColorRgb
         *
         * Parameters:
         * red - {Integer}
         * green - {Integer}
         * blue - {Integer}
         */
        initialize: function(red, green, blue) {
            this.redLevel = red;
            this.greenLevel = green;
            this.blueLevel = blue;
        },

        /**
         * APIMethod: equals
         *      Returns true if the colors at the same.
         *
         * Parameters:
         * {<mapfish.ColorRgb>} color
         */
        equals: function(color) {
            return color.redLevel == this.redLevel &&
                color.greenLevel == this.greenLevel &&
                color.blueLevel == this.blueLevel;
        },

        getColorRgb: function() {
            return this;
        },

        getRgbArray: function() {
            return [
                this.redLevel,
                this.greenLevel,
                this.blueLevel
            ];
        },

        /**
         * Method: hex2rgbArray
         * Converts a Hex color string to an Rbg array
         *
         * Parameters:
         * rgbHexString - {String} Hex color string (format: #rrggbb)
         */
        hex2rgbArray: function(rgbHexString) {
            if (rgbHexString.charAt(0) == '#') {
                rgbHexString = rgbHexString.substr(1);
            }
            var rgbArray = [
                parseInt(rgbHexString.substring(0, 2), 16),
                parseInt(rgbHexString.substring(2, 4), 16),
                parseInt(rgbHexString.substring(4, 6), 16)
            ];
            for (var i = 0; i < rgbArray.length; i++) {
                if (rgbArray[i] < 0 || rgbArray[i] > 255) {
                    OpenLayers.Console.error("Invalid rgb hex color string: rgbHexString");
                }
            }
            return rgbArray;
        },

        /**
         * APIMethod: setFromHex
         * Sets the color from a color hex string
         *
         * Parameters:
         * rgbHexString - {String} Hex color string (format: #rrggbb)
         */
        setFromHex: function(rgbHexString) {
            var rgbArray = this.hex2rgbArray(rgbHexString);
            this.redLevel = rgbArray[0];
            this.greenLevel = rgbArray[1];
            this.blueLevel = rgbArray[2];
        },

        /**
         * APIMethod: setFromRgb
         * Sets the color from a color rgb string
         *
         */
        setFromRgb: function(rgbString) {
            var color = dojo.colorFromString(rgbString);
            this.redLevel = color.r;
            this.greenLevel = color.g;
            this.blueLevel = color.b;
        },

        /**
         * APIMethod: toHexString
         * Converts the rgb color to hex string
         *
         */
        toHexString: function() {
            var r = this.toHex(this.redLevel);
            var g = this.toHex(this.greenLevel);
            var b = this.toHex(this.blueLevel);
            return '#' + r + g + b;
        },

        /**
         * Method: toHex
         * Converts a color level to its hexadecimal value
         *
         * Parameters:
         * dec - {Integer} Decimal value to convert [0..255]
         */
        toHex: function(dec) {
            // create list of hex characters
            var hexCharacters = "0123456789ABCDEF";
            // if number is out of range return limit
            if (dec < 0 || dec > 255) {
                var msg = "Invalid decimal value for color level";
                OpenLayers.Console.error(msg);
            }
            // decimal equivalent of first hex character in converted number
            var i = Math.floor(dec / 16);
            // decimal equivalent of second hex character in converted number
            var j = dec % 16;
            // return hexadecimal equivalent
            return hexCharacters.charAt(i) + hexCharacters.charAt(j);
        },

        CLASS_NAME: "mapfish.ColorRgb"
    });

    /**
     * APIMethod: getColorsArrayByRgbInterpolation
     *      Get an array of colors based on RGB interpolation.
     *
     * Parameters:
     * firstColor - {<mapfish.Color>} The first color in the range.
     * lastColor - {<mapfish.Color>} The last color in the range.
     * nbColors - {Integer} The number of colors in the range.
     *
     * Returns
     * {Array({<mapfish.Color>})} The resulting array of colors.
     */
    mapfish.ColorRgb.getColorsArrayByRgbInterpolation = function(firstColor, lastColor, nbColors) {
        var resultColors = [];
        var colorA = firstColor.getColorRgb();
        var colorB = lastColor.getColorRgb();
        var colorAVal = colorA.getRgbArray();
        var colorBVal = colorB.getRgbArray();
        if (nbColors == 1) {
            return [colorA];
        }
        for (var i = 0; i < nbColors; i++) {
            var rgbTriplet = [];
            rgbTriplet[0] = colorAVal[0] +
            i * (colorBVal[0] - colorAVal[0]) / (nbColors - 1);
            rgbTriplet[1] = colorAVal[1] +
            i * (colorBVal[1] - colorAVal[1]) / (nbColors - 1);
            rgbTriplet[2] = colorAVal[2] +
            i * (colorBVal[2] - colorAVal[2]) / (nbColors - 1);
            resultColors[i] = new mapfish.ColorRgb(parseInt(rgbTriplet[0]),
                parseInt(rgbTriplet[1]), parseInt(rgbTriplet[2]));
        }
        return resultColors;
    };


    // MAPFISH UTIL (util.js)

    /**
     * Namespace: mapfish.Util
     * Utility functions
     */
    mapfish.Util = {};

    /**
     * APIFunction: sum
     * Return the sum of the elements of an array.
     */
    mapfish.Util.sum = function(array) {
        for (var i = 0, sum = 0; i < array.length; sum += array[i++]);
        return sum;
    };

    /**
     * APIFunction: max
     * Return the max of the elements of an array.
     */
    mapfish.Util.max = function(array) {
        return Math.max.apply({}, array);
    };

    /**
     * APIFunction: min
     * Return the min of the elements of an array.
     */
    mapfish.Util.min = function(array) {
        return Math.min.apply({}, array);
    };

    /**
     * Function: getIconUrl
     * Builds the URL for a layer icon, based on a WMS GetLegendGraphic request.
     *
     * Parameters:
     * wmsUrl - {String} The URL of a WMS server.
     * options - {Object} The options to set in the request:
     *                    'layer' - the name of the layer for which the icon is requested (required)
     *                    'rule' - the name of a class for this layer (this is set to the layer name if not specified)
     *                    'format' - "image/png" by default
     *                    ...
     *
     * Returns:
     * {String} The URL at which the icon can be found.
     */
    mapfish.Util.getIconUrl = function(wmsUrl, options) {
        if (!options.layer) {
            OpenLayers.Console.warn(
                'Missing required layer option in mapfish.Util.getIconUrl');
            return '';
        }
        if (!options.rule) {
            options.rule = options.layer;
        }
        if (wmsUrl.indexOf("?") < 0) {
            //add a ? to the end of the url if it doesn't
            //already contain one
            wmsUrl += "?";
        } else if (wmsUrl.lastIndexOf('&') != (wmsUrl.length - 1)) {
            //if there was already a ? , assure that the parameters
            //are ended with an &, except if the ? was at the last char
            if (wmsUrl.indexOf("?") != (wmsUrl.length - 1)) {
                wmsUrl += "&";
            }
        }
        var options = OpenLayers.Util.extend({
            layer: "",
            rule: "",
            service: "WMS",
            version: "1.1.1",
            request: "GetLegendGraphic",
            format: "image/png",
            width: 16,
            height: 16
        }, options);
        options = OpenLayers.Util.upperCaseObject(options);
        return wmsUrl + OpenLayers.Util.getParameterString(options);
    };


    /**
     * APIFunction: arrayEqual
     * Compare two arrays containing primitive types.
     *
     * Parameters:
     * a - {Array} 1st to be compared.
     * b - {Array} 2nd to be compared.
     *
     * Returns:
     * {Boolean} True if both given arrays contents are the same (elements value and type).
     */
    mapfish.Util.arrayEqual = function(a, b) {
        if (a == null || b == null)
            return false;
        if (typeof (a) != 'object' || typeof (b) != 'object')
            return false;
        if (a.length != b.length)
            return false;
        for (var i = 0; i < a.length; i++) {
            if (typeof (a[i]) != typeof (b[i]))
                return false;
            if (a[i] != b[i])
                return false;
        }
        return true;
    };

    /**
     * Function: isIE7
     *
     * Returns:
     * {Boolean} True if the browser is Internet Explorer V7
     */
    mapfish.Util.isIE7 = function() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf("msie 7") > -1;
    };

    /**
     * APIFunction: relativeToAbsoluteURL
     *
     * Parameters:
     * source - {String} the source URL
     *
     * Returns:
     * {String} An absolute URL
     */
    mapfish.Util.relativeToAbsoluteURL = function(source) {
        if (/^\w+:/.test(source) || !source) {
            return source;
        }

        var h = location.protocol + "//" + location.host;
        if (source.indexOf("/") == 0) {
            return h + source;
        }

        var p = location.pathname.replace(/\/[^\/]*$/, '');
        return h + p + "/" + source;
    };

    /**
     * Function: fixArray
     *
     * In some fields, OpenLayers allows to use a coma separated string instead
     * of an array. This method make sure we end up with an array.
     *
     * Parameters:
     * subs - {String/Array}
     *
     * Returns:
     * {Array}
     */
    mapfish.Util.fixArray = function(subs) {
        if (subs == '' || subs == null) {
            return [];
        } else if (subs instanceof Array) {
            return subs;
        } else {
            return subs.split(',');
        }
    };


    // MAPFISH GEOSTAT (geostat.js)

    /**
     * @requires OpenLayers/Layer/Vector.js
     * @requires OpenLayers/Popup/AnchoredBubble.js
     * @requires OpenLayers/Feature/Vector.js
     * @requires OpenLayers/Format/GeoJSON.js
     * @requires OpenLayers/Control/SelectFeature.js
     * @requires OpenLayers/Ajax.js
     */

    mapfish.GeoStat = OpenLayers.Class({

        layer: null,

        format: null,

        url: null,

        requestSuccess: function(request) {},

        requestFailure: function(request) {},

        indicator: null,

        defaultSymbolizer: {},

        legendDiv: null,

        initialize: function(map, options) {
            this.map = map;
            this.addOptions(options);
            if (!this.layer) {
                var layer = new OpenLayers.Layer.Vector('geostat', {
                    'displayInLayerSwitcher': false,
                    'visibility': false
                });
                map.addLayer(layer);
                this.layer = layer;
            }

            this.setUrl(this.url);
            this.legendDiv = Ext.get(options.legendDiv);
        },

        setUrl: function(url) {
            this.url = url;
            if (this.url) {
                OpenLayers.Request.GET({
                    url: this.url,
                    scope: this,
                    success: this.requestSuccess,
                    failure: this.requestFailure
                });
            }
        },

        getColors: function(low, high) {
            var startColor = new mapfish.ColorRgb(),
                endColor = new mapfish.ColorRgb()
            startColor.setFromHex(low);
            endColor.setFromHex(high);
            return [startColor, endColor];
        },

        addOptions: function(newOptions) {
            if (newOptions) {
                if (!this.options) {
                    this.options = {};
                }
                // update our copy for clone
                OpenLayers.Util.extend(this.options, newOptions);
                // add new options to this
                OpenLayers.Util.extend(this, newOptions);
            }
        },

        extendStyle: function(rules, symbolizer, context) {
            var style = this.layer.styleMap.styles['default'];
            if (rules) {
                style.rules = rules;
            }
            if (symbolizer) {
                style.setDefaultStyle(
                    OpenLayers.Util.applyDefaults(
                        symbolizer,
                        style.defaultStyle
                    )
                );
            }
            if (context) {
                if (!style.context) {
                    style.context = {};
                }
                OpenLayers.Util.extend(style.context, context);
            }
        },

        applyClassification: function(options) {
            this.layer.renderer.clear();
            this.layer.redraw();
            this.updateLegend();
            this.layer.setVisibility(true);
        },

        showDetails: function(obj) {},

        hideDetails: function(obj) {},

        CLASS_NAME: "mapfish.GeoStat"
    });

    mapfish.GeoStat.Distribution = OpenLayers.Class({

        labelGenerator: function(bin, binIndex, nbBins) {
            var lower = parseFloat(bin.lowerBound).toFixed(1),
                upper = parseFloat(bin.upperBound).toFixed(1);
            return lower + ' - ' + upper + '&nbsp;&nbsp;' + '(' + bin.nbVal + ')';
        },

        values: null,

        nbVal: null,

        minVal: null,

        maxVal: null,

        initialize: function(values, options) {
            OpenLayers.Util.extend(this, options);
            this.values = values;
            this.nbVal = values.length;
            this.minVal = this.nbVal ? mapfish.Util.min(this.values) : 0;
            this.maxVal = this.nbVal ? mapfish.Util.max(this.values) : 0;
        },

        classifyWithBounds: function(bounds) {
            var bins = [];
            var binCount = [];
            var sortedValues = [];

            for (var i = 0; i < this.values.length; i++) {
                sortedValues.push(this.values[i]);
            }
            sortedValues.sort(function(a, b) {
                return a - b;
            });
            var nbBins = bounds.length - 1;

            for (var j = 0; j < nbBins; j++) {
                binCount[j] = 0;
            }

            for (var k = 0; k < nbBins - 1; k) {
                if (sortedValues[0] < bounds[k + 1]) {
                    binCount[k] = binCount[k] + 1;
                    sortedValues.shift();
                } else {
                    k++;
                }
            }

            binCount[nbBins - 1] = this.nbVal - mapfish.Util.sum(binCount);

            for (var m = 0; m < nbBins; m++) {
                bins[m] = new mapfish.GeoStat.Bin(binCount[m], bounds[m], bounds[m + 1], m == (nbBins - 1));
                var labelGenerator = this.labelGenerator || this.defaultLabelGenerator;
                bins[m].label = labelGenerator(bins[m], m, nbBins);
            }

            return new mapfish.GeoStat.Classification(bins);
        },

        classifyByEqIntervals: function(nbBins) {
            var bounds = [];

            for (var i = 0; i <= nbBins; i++) {
                bounds[i] = this.minVal + i * (this.maxVal - this.minVal) / nbBins;
            }

            return this.classifyWithBounds(bounds);
        },

        classifyByQuantils: function(nbBins) {
            var values = this.values;
            values.sort(function(a, b) {
                return a - b;
            });
            var binSize = Math.round(this.values.length / nbBins);

            var bounds = [];
            var binLastValPos = (binSize === 0) ? 0 : binSize;

            if (values.length > 0) {
                bounds[0] = values[0];
                for (i = 1; i < nbBins; i++) {
                    bounds[i] = values[binLastValPos];
                    binLastValPos += binSize;
                }
                bounds.push(values[values.length - 1]);
            }

            for (var j = 0; j < bounds.length; j++) {
                bounds[j] = parseFloat(bounds[j]);
            }

            return this.classifyWithBounds(bounds);
        },

        sturgesRule: function() {
            return Math.floor(1 + 3.3 * Math.log(this.nbVal, 10));
        },

        classify: function(method, nbBins, bounds) {
            var classification = null;
            if (!nbBins) {
                nbBins = this.sturgesRule();
            }

            switch (parseFloat(method)) {
                case mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS:
                    classification = this.classifyWithBounds(bounds);
                    break;
                case mapfish.GeoStat.Distribution.CLASSIFY_BY_EQUAL_INTERVALS:
                    classification = this.classifyByEqIntervals(nbBins);
                    break;
                case mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS:
                    classification = this.classifyByQuantils(nbBins);
                    break;
                default:
                    OpenLayers.Console.error("Unsupported or invalid classification method");
            }
            return classification;
        },

        CLASS_NAME: "mapfish.GeoStat.Distribution"
    });

    mapfish.GeoStat.Distribution.CLASSIFY_WITH_BOUNDS = 1;

    mapfish.GeoStat.Distribution.CLASSIFY_BY_EQUAL_INTERVALS = 2;

    mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS = 3;

    mapfish.GeoStat.Bin = OpenLayers.Class({
        label: null,
        nbVal: null,
        lowerBound: null,
        upperBound: null,
        isLast: false,

        initialize: function(nbVal, lowerBound, upperBound, isLast) {
            this.nbVal = nbVal;
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
            this.isLast = isLast;
        },

        CLASS_NAME: "mapfish.GeoStat.Bin"
    });

    mapfish.GeoStat.Classification = OpenLayers.Class({
        bins: [],

        initialize: function(bins) {
            this.bins = bins;
        },

        getBoundsArray: function() {
            var bounds = [];
            for (var i = 0; i < this.bins.length; i++) {
                bounds.push(this.bins[i].lowerBound);
            }
            if (this.bins.length > 0) {
                bounds.push(this.bins[this.bins.length - 1].upperBound);
            }
            return bounds;
        },

        CLASS_NAME: "mapfish.GeoStat.Classification"
    });


    // MAPFISH ALL (all.js)

    /**
     * @requires core/GeoStat.js
     */

    mapfish.GeoStat.Facility = OpenLayers.Class(mapfish.GeoStat, {

        classification: null,

        gis: null,
        view: null,

        initialize: function(map, options) {
            mapfish.GeoStat.prototype.initialize.apply(this, arguments);
        },

        getLoader: function() {
            return GIS.core.LayerLoaderFacility(this.gis, this.layer);
        },

        decode: function(organisationUnits) {
            var feature,
                group,
                attr,
                geojson = {
                    type: 'FeatureCollection',
                    crs: {
                        type: 'EPSG',
                        properties: {
                            code: '4326'
                        }
                    },
                    features: []
                };

            for (var i = 0; i < organisationUnits.length; i++) {
                attr = organisationUnits[i];

                feature = {
                    type: 'Feature',
                    geometry: {
                        type: parseInt(attr.ty) === 1 ? 'Point' : 'MultiPolygon',
                        coordinates: JSON.parse(attr.co)
                    },
                    properties: {
                        id: attr.id,
                        name: attr.na
                    }
                };
                feature.properties = Ext.Object.merge(feature.properties, attr.dimensions);

                geojson.features.push(feature);
            }

            return geojson;
        },

        reset: function() {
            this.layer.destroyFeatures();

            // legend
            if (this.layer.legendPanel) {
                this.layer.legendPanel.update('');
                this.layer.legendPanel.collapse();
            }

            if (this.layer.widget) {
                this.layer.widget.reset();
            }
        },

        extendView: function(view, config) {
            view = view || this.view;

            view.organisationUnitGroupSet = config.organisationUnitGroupSet || view.organisationUnitGroupSet;
            view.organisationUnitLevel = config.organisationUnitLevel || view.organisationUnitLevel;
            view.parentOrganisationUnit = config.parentOrganisationUnit || view.parentOrganisationUnit;
            view.parentLevel = config.parentLevel || view.parentLevel;
            view.parentGraph = config.parentGraph || view.parentGraph;
            view.opacity = config.opacity || view.opacity;

            return view;
        },

        updateOptions: function(newOptions) {
            this.addOptions(newOptions);
        },

        applyClassification: function(options) {
            this.updateOptions(options);

            var items = this.gis.store.groupsByGroupSet.data.items;

            var rules = new Array(items.length);
            for (var i = 0; i < items.length; i++) {
                var rule = new OpenLayers.Rule({
                    symbolizer: {
                        'pointRadius': 8,
                        'externalGraphic': '../images/orgunitgroup/' + items[i].data.symbol
                    },
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: this.indicator,
                        value: items[i].data.name
                    })
                });
                rules[i] = rule;
            }

            this.extendStyle(rules);
            mapfish.GeoStat.prototype.applyClassification.apply(this, arguments);
        },

        updateLegend: function() {
            var element = document.createElement("div"),
                child = document.createElement("div"),
                items = this.gis.store.groupsByGroupSet.data.items;

            for (var i = 0; i < items.length; i++) {
                child = document.createElement("div");
                child.style.backgroundImage = 'url(../images/orgunitgroup/' + items[i].data.symbol + ')';
                child.style.backgroundRepeat = 'no-repeat';
                child.style.width = "21px";
                child.style.height = "16px";
                child.style.marginBottom = "2px";
                child.style.cssFloat = "left";
                element.appendChild(child);

                child = document.createElement("div");
                child.innerHTML = items[i].data.name;
                child.style.height = "16px";
                child.style.lineHeight = "17px";
                element.appendChild(child);

                child = document.createElement("div");
                child.style.clear = "left";
                element.appendChild(child);
            }

            if (this.layer.legendPanel) {
                this.layer.legendPanel.update(element.outerHTML);
            }

            return element;
        },

        CLASS_NAME: "mapfish.GeoStat.Facility"
    });

    mapfish.GeoStat.Event = OpenLayers.Class(mapfish.GeoStat, {

        colors: [new mapfish.ColorRgb(120, 120, 0), new mapfish.ColorRgb(255, 0, 0)],
        method: mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS,
        numClasses: 5,
        minSize: 4,
        maxSize: 4,
        minVal: null,
        maxVal: null,
        defaultSymbolizer: {
            'fillOpacity': 1
        },
        classification: null,
        colorInterpolation: null,

        gis: null,
        view: null,

        initialize: function(map, options) {
            mapfish.GeoStat.prototype.initialize.apply(this, arguments);
        },

        getLoader: function() {
            return GIS.core.LayerLoaderEvent(this.gis, this.layer);
        },

        reset: function() {
            this.layer.destroyFeatures();

            if (this.layer.widget) {
                this.layer.widget.reset();
            }
        },

        extendView: function(view, config) {
            view = view || this.view;

            view.organisationUnitLevel = config.organisationUnitLevel || view.organisationUnitLevel;
            view.parentOrganisationUnit = config.parentOrganisationUnit || view.parentOrganisationUnit;
            view.parentLevel = config.parentLevel || view.parentLevel;
            view.parentGraph = config.parentGraph || view.parentGraph;
            view.opacity = config.opacity || view.opacity;

            return view;
        },

        getLegendConfig: function() {
            return;
        },

        getImageLegendConfig: function() {
            return;
        },

        updateOptions: function(newOptions) {
            var oldOptions = OpenLayers.Util.extend({}, this.options);
            this.addOptions(newOptions);
            if (newOptions) {
                this.setClassification();
            }
        },

        createColorInterpolation: function() {
            var numColors = this.classification.bins.length;

            this.colorInterpolation = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(this.colors[0], this.colors[1], numColors);
        },

        setClassification: function() {
            var values = [];
            for (var i = 0; i < this.layer.features.length; i++) {
                values.push(this.layer.features[i].attributes[this.indicator]);
            }

            var distOptions = {
                labelGenerator: this.options.labelGenerator
            };
            var dist = new mapfish.GeoStat.Distribution(values, distOptions);

            this.minVal = dist.minVal;
            this.maxVal = dist.maxVal;

            this.classification = dist.classify(
                this.method,
                this.numClasses,
                null
            );

            this.createColorInterpolation();
        },

        applyClassification: function(options) {
            this.updateOptions(options);

            var calculateRadius = OpenLayers.Function.bind(
                function(feature) {
                    var value = feature.attributes[this.indicator];
                    var size = (value - this.minVal) / (this.maxVal - this.minVal) *
                        (this.maxSize - this.minSize) + this.minSize;
                    return size || this.minSize;
                }, this
            );
            this.extendStyle(null, {
                'pointRadius': '${calculateRadius}'
            }, {
                'calculateRadius': calculateRadius
            });

            var boundsArray = this.classification.getBoundsArray();
            var rules = new Array(boundsArray.length - 1);
            for (var i = 0; i < boundsArray.length - 1; i++) {
                var rule = new OpenLayers.Rule({
                    symbolizer: {
                        fillColor: this.colorInterpolation[i].toHexString()
                    },
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: this.indicator,
                        lowerBoundary: boundsArray[i],
                        upperBoundary: boundsArray[i + 1]
                    })
                });
                rules[i] = rule;
            }

            this.extendStyle(rules);
            mapfish.GeoStat.prototype.applyClassification.apply(this, arguments);
        },

        updateLegend: function() {
            return {};
        },

        CLASS_NAME: "mapfish.GeoStat.Event"
    });

    mapfish.GeoStat.Boundary = OpenLayers.Class(mapfish.GeoStat, {

        colors: [new mapfish.ColorRgb(120, 120, 0), new mapfish.ColorRgb(255, 0, 0)],
        method: mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS,
        numClasses: 5,
        minSize: 3,
        maxSize: 20,
        minVal: null,
        maxVal: null,
        defaultSymbolizer: {
            'fillOpacity': 1
        },
        classification: null,
        colorInterpolation: null,

        gis: null,
        view: null,

        initialize: function(map, options) {
            mapfish.GeoStat.prototype.initialize.apply(this, arguments);
        },

        getLoader: function() {
            return GIS.core.LayerLoaderBoundary(this.gis, this.layer);
        },

        reset: function() {
            this.layer.destroyFeatures();

            if (this.layer.widget) {
                this.layer.widget.reset();
            }
        },

        extendView: function(view, config) {
            view = view || this.view;

            view.organisationUnitLevel = config.organisationUnitLevel || view.organisationUnitLevel;
            view.parentOrganisationUnit = config.parentOrganisationUnit || view.parentOrganisationUnit;
            view.parentLevel = config.parentLevel || view.parentLevel;
            view.parentGraph = config.parentGraph || view.parentGraph;
            view.opacity = config.opacity || view.opacity;

            return view;
        },

        getLegendConfig: function() {
            return;
        },

        getImageLegendConfig: function() {
            return;
        },

        getDefaultFeatureStyle: function() {
            return {
                fillOpacity: 0,
                fillColor: '#000',
                strokeColor: '#000',
                strokeWidth: 1,
                pointRadius: 5,
                cursor: 'pointer'
            };
        },

        setFeatureStyle: function(style) {
            for (var i = 0; i < this.layer.features.length; i++) {
                this.layer.features[i].style = style;
            }

            this.layer.redraw();
        },

        setFeatureLabelStyle: function(isLabel, skipDraw, view) {
            for (var i = 0, feature, style, label; i < this.layer.features.length; i++) {
                feature = this.layer.features[i];
                style = feature.style;

                if (isLabel) {
                    style.label = feature.attributes.label;
                    style.fontColor = style.strokeColor;
                    style.fontWeight = style.strokeWidth > 1 ? 'bold' : 'normal';
                    style.labelAlign = 'cr';
                    style.labelYOffset = 13;

                    if (view.labelFontSize) {
                        style.fontSize = view.labelFontSize;
                    }
                    if (view.labelFontStyle) {
                        style.fontStyle = view.labelFontStyle;
                    }
                } else {
                    style.label = null;
                }
            }

            if (!skipDraw)  {
                this.layer.redraw();
            }
        },

        updateOptions: function(newOptions) {
            var oldOptions = OpenLayers.Util.extend({}, this.options);
            this.addOptions(newOptions);
            if (newOptions) {
                this.setClassification();
            }
        },

        createColorInterpolation: function() {
            var numColors = this.classification.bins.length;

            this.colorInterpolation = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(this.colors[0], this.colors[1], numColors);
        },

        setClassification: function() {
            var values = [];
            for (var i = 0; i < this.layer.features.length; i++) {
                values.push(this.layer.features[i].attributes[this.indicator]);
            }

            var distOptions = {
                labelGenerator: this.options.labelGenerator
            };
            var dist = new mapfish.GeoStat.Distribution(values, distOptions);

            this.minVal = dist.minVal;
            this.maxVal = dist.maxVal;

            this.classification = dist.classify(
                this.method,
                this.numClasses,
                null
            );

            this.createColorInterpolation();
        },

        applyClassification: function(options) {
            this.updateOptions(options);

            var calculateRadius = OpenLayers.Function.bind(
                function(feature) {
                    var value = feature.attributes[this.indicator];
                    var size = (value - this.minVal) / (this.maxVal - this.minVal) *
                        (this.maxSize - this.minSize) + this.minSize;
                    return size || this.minSize;
                }, this
            );
            this.extendStyle(null, {
                'pointRadius': '${calculateRadius}'
            }, {
                'calculateRadius': calculateRadius
            });

            var boundsArray = this.classification.getBoundsArray();
            var rules = new Array(boundsArray.length - 1);
            for (var i = 0; i < boundsArray.length - 1; i++) {
                var rule = new OpenLayers.Rule({
                    symbolizer: {
                        fillColor: this.colorInterpolation[i].toHexString()
                    },
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: this.indicator,
                        lowerBoundary: boundsArray[i],
                        upperBoundary: boundsArray[i + 1]
                    })
                });
                rules[i] = rule;
            }

            this.extendStyle(rules);
            mapfish.GeoStat.prototype.applyClassification.apply(this, arguments);
        },

        updateLegend: function() {
            return {};
        },

        CLASS_NAME: "mapfish.GeoStat.Boundary"
    });

    mapfish.GeoStat.createThematic = function(name) {

        mapfish.GeoStat[name] = OpenLayers.Class(mapfish.GeoStat, {
            colors: [new mapfish.ColorRgb(120, 120, 0), new mapfish.ColorRgb(255, 0, 0)],
            method: mapfish.GeoStat.Distribution.CLASSIFY_BY_QUANTILS,
            numClasses: 5,
            bounds: null,
            minSize: 3,
            maxSize: 20,
            minVal: null,
            maxVal: null,
            defaultSymbolizer: {
                'fillOpacity': 1
            },
            classification: null,
            colorInterpolation: null,

            gis: null,
            view: null,

            initialize: function(map, options) {
                mapfish.GeoStat.prototype.initialize.apply(this, arguments);
            },

            getLoader: function() {
                return GIS.core.LayerLoaderThematic(this.gis, this.layer);
            },

            reset: function() {
                this.layer.destroyFeatures();
                //this.featureStore.loadFeatures(this.layer.features.slice(0));

                // legend
                if (this.layer.legendPanel) {
                    this.layer.legendPanel.update('');
                    this.layer.legendPanel.collapse();
                }

                // widget
                if (this.layer.widget) {
                    this.layer.widget.reset();
                }
            },

            extendView: function(view, config) {
                view = view || this.view;

                view.valueType = config.valueType || view.valueType;
                view.indicatorGroup = config.indicatorGroup || view.indicatorGroup;
                view.indicator = config.indicator || view.indicator;
                view.dataElementGroup = config.dataElementGroup || view.dataElementGroup;
                view.dataElement = config.dataElement || view.dataElement;
                view.periodType = config.periodType || view.periodType;
                view.period = config.period || view.period;
                view.legendType = config.legendType || view.legendType;
                view.legendSet = config.legendSet || view.legendSet;
                view.classes = config.classes || view.classes;
                view.method = config.method || view.method;
                view.colorLow = config.colorLow || view.colorLow;
                view.colorHigh = config.colorHigh || view.colorHigh;
                view.radiusLow = config.radiusLow || view.radiusLow;
                view.radiusHigh = config.radiusHigh || view.radiusHigh;
                view.organisationUnitLevel = config.organisationUnitLevel || view.organisationUnitLevel;
                view.parentOrganisationUnit = config.parentOrganisationUnit || view.parentOrganisationUnit;
                view.parentLevel = config.parentLevel || view.parentLevel;
                view.parentGraph = config.parentGraph || view.parentGraph;
                view.opacity = config.opacity || view.opacity;

                return view;
            },

            getImageLegendConfig: function() {
                var bins = this.classification.bins,
                    rgb = this.colorInterpolation,
                    config = [];

                for (var i = 0; i < bins.length; i++) {
                    config.push({
                        color: rgb[i].toHexString(),
                        label: bins[i].lowerBound.toFixed(1) + ' - ' + bins[i].upperBound.toFixed(1) + ' (' + bins[i].nbVal + ')'
                    });
                }

                return config;
            },

            updateOptions: function(newOptions) {
                var oldOptions = OpenLayers.Util.extend({}, this.options);
                this.addOptions(newOptions);
                if (newOptions) {
                    this.setClassification();
                }
            },

            createColorInterpolation: function() {
                var numColors = this.classification.bins.length;

                if (!this.view.legendSet) {
                    this.colorInterpolation = mapfish.ColorRgb.getColorsArrayByRgbInterpolation(this.colors[0], this.colors[1], numColors);
                }
            },

            setClassification: function() {
                var values = [];
                for (var i = 0; i < this.layer.features.length; i++) {
                    values.push(this.layer.features[i].attributes[this.indicator]);
                }

                var distOptions = {
                    labelGenerator: this.options.labelGenerator
                };
                var dist = new mapfish.GeoStat.Distribution(values, distOptions);

                this.minVal = dist.minVal;
                this.maxVal = dist.maxVal;

                if (this.view.legendType === this.gis.conf.finals.widget.legendtype_predefined) {
                    if (this.bounds[0] > this.minVal) {
                        this.bounds.unshift(this.minVal);
                        //if (this.widget == centroid) { this.widget.symbolizerInterpolation.unshift('blank');
                        this.colorInterpolation.unshift(new mapfish.ColorRgb(240, 240, 240));
                    }

                    if (this.bounds[this.bounds.length - 1] < this.maxVal) {
                        this.bounds.push(this.maxVal);
                        //todo if (this.widget == centroid) { G.vars.activeWidget.symbolizerInterpolation.push('blank');
                        this.colorInterpolation.push(new mapfish.ColorRgb(240, 240, 240));
                    }
                }

                this.classification = dist.classify(
                    this.method,
                    this.numClasses,
                    this.bounds
                );

                this.createColorInterpolation();
            },

            applyClassification: function(options, legend) {
                this.updateOptions(options, legend);

                var calculateRadius = OpenLayers.Function.bind(
                    function(feature) {
                        var value = feature.attributes[this.indicator];
                        var size = (value - this.minVal) / (this.maxVal - this.minVal) *
                            (this.maxSize - this.minSize) + this.minSize;
                        return size || this.minSize;
                    }, this
                );
                this.extendStyle(null, {
                    'pointRadius': '${calculateRadius}'
                }, {
                    'calculateRadius': calculateRadius
                });

                var boundsArray = this.classification.getBoundsArray();
                var rules = new Array(boundsArray.length - 1);
                for (var i = 0; i < boundsArray.length - 1; i++) {
                    var rule = new OpenLayers.Rule({
                        symbolizer: {
                            fillColor: this.colorInterpolation[i].toHexString()
                        },
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.BETWEEN,
                            property: this.indicator,
                            lowerBoundary: boundsArray[i],
                            upperBoundary: boundsArray[i + 1]
                        })
                    });
                    rules[i] = rule;
                }

                this.extendStyle(rules);
                mapfish.GeoStat.prototype.applyClassification.apply(this, arguments);
            },

            updateLegend: function() {
                var view = this.view,
                    response = this.gis.response,
                    isPlugin = this.gis.plugin,
                    element = document.createElement("div"),
                    legendNames = view.legendSet ? view.legendSet.names || {} : {},
                    style = {},
                    child,
                    id,
                    name;

                style.dataLineHeight = isPlugin ? '12px' : '14px';
                style.dataPaddingBottom = isPlugin ? '2px' : '3px';
                style.colorWidth = isPlugin ? '15px' : '30px';
                style.colorHeight = isPlugin ? '13px' : '15px';
                style.colorMarginRight = isPlugin ? '5px' : '8px';
                style.fontSize = isPlugin ? '10px' : '11px';

                // data
                id = view.columns[0].items[0].id;
                name = view.columns[0].items[0].name;
                child = document.createElement("div");
                child.style.fontSize = style.fontSize;
                child.style.lineHeight = style.dataLineHeight;
                child.style.paddingBottom = style.dataPaddingBottom;
                child.innerHTML += '<div style="color:#222; font-size:10px !important">' + (response.metaData.names[id] || name || id) + '</div>';

                // period
                id = view.filters[0].items[0].id;
                name = view.filters[0].items[0].name;
                child.innerHTML += response.metaData.names[id] || name || id;
                element.appendChild(child);

                child = document.createElement("div");
                child.style.clear = "left";
                element.appendChild(child);

                // legends
                if (view.legendSet) {
                    for (var i = 0; i < this.classification.bins.length; i++) {
                        child = document.createElement("div");
                        child.style.fontSize = style.fontSize;
                        child.style.backgroundColor = this.colorInterpolation[i].toHexString();
                        child.style.width = style.colorWidth;
                        child.style.height = legendNames[i] ? '22px' : style.colorHeight;
                        child.style.cssFloat = 'left';
                        child.style.marginRight = style.colorMarginRight;
                        element.appendChild(child);

                        child = document.createElement("div");
                        child.style.height = legendNames[i] ? '22px' : style.colorHeight;
                        child.style.fontSize = style.fontSize;
                        child.style.lineHeight = legendNames[i] ? "12px" : "7px";
                        child.innerHTML = '<div style="color:#222; font-size:10px !important; height:11px; line-height:12px; font-weight:bold;">' + (legendNames[i] || '') + '</div>';
                        child.innerHTML += '<div style="color:#222; font-size:10px !important; height:11px; line-height:12px">' + this.classification.bins[i].label + '</div>';
                        element.appendChild(child);

                        child = document.createElement("div");
                        child.style.clear = "left";
                        element.appendChild(child);
                    }
                }
                else {
                    for (var i = 0; i < this.classification.bins.length; i++) {
                        child = document.createElement("div");
                        child.style.backgroundColor = this.colorInterpolation[i].toHexString();
                        child.style.width = style.colorWidth;
                        child.style.height = style.colorHeight;
                        child.style.cssFloat = 'left';
                        child.style.marginRight = style.colorMarginRight;
                        element.appendChild(child);

                        child = document.createElement("div");
                        child.style.height = style.colorHeight;
                        child.style.fontSize = style.fontSize;
                        child.innerHTML = this.classification.bins[i].label;
                        element.appendChild(child);

                        child = document.createElement("div");
                        child.style.clear = "left";
                        element.appendChild(child);
                    }
                }

                if (this.layer.legendPanel) {
                    this.layer.legendPanel.update(element.outerHTML);
                }

                return element;
            },

            CLASS_NAME: "mapfish.GeoStat." + name
        });
    };

    mapfish.GeoStat.createThematic('Thematic1');
    mapfish.GeoStat.createThematic('Thematic2');
    mapfish.GeoStat.createThematic('Thematic3');
    mapfish.GeoStat.createThematic('Thematic4');

}());
