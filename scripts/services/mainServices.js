var mainServices = angular.module('mainServices',['ngResource', 'olData','olHelpers','shared'])
    .value('DHIS2URL', '../../..')
    .value('projectObjectName','organisationUnitGroups');
mainServices.factory('mapManager',function($http,DHIS2URL,$q,olData,olHelpers,shared){

    var mapManager = {
        saveColorInLocalStorag:function(){
            if(mapManager.getColorFromLocalStorage( id )){
                localStorage.setItem( id , value);
            }
        },
        getColorFromLocalStorage:function ( id ) {
            var Item = localStorage.getItem( id );
            if (!Item) {
                return false;
            } else {
                return Item;
            }
        },
        renderMap:function ( parentUid , cardObject ,level) {
            var max_and_min     = mapManager.getMaxAndMin(cardObject);
            var legend          = mapManager.getLegend(max_and_min);
            cardObject.legend   = legend;
            mapManager.shared   = shared;
            shared.facility = 3029;
            var url = DHIS2URL+'/api/organisationUnits.geojson?parent='+parentUid+'&level='+level;
            $http.get(url).success(function(data){
                cardObject.chartObject.loading = true;
                var TotalGeo = {
                    "type":"FeatureCollection",
                    "features":[]
                };

                var districtProperties = [];

                var dateObject = new Date();
                mapManager.thisYear = dateObject.getFullYear();
                cardObject.districts = {};
                cardObject.DistrictFreeObject = [];

                angular.forEach(data.features, function( value , index ){

                    var appropiateColor = mapManager.decideOnColor(max_and_min,legend,value);
                    // creating dynamic colors for district
                    mapManager.saveColorInLocalStorag(cardObject.prepareId(cardObject,value.id),appropiateColor.color);

                    // prepare objects of district for properties to display on tooltip
                    districtProperties[mapManager.prepareId(cardObject,value.id)] = {
                        district_id:mapManager.prepareId(cardObject,value.id),
                        year:mapManager.thisYear,
                        name:value.properties.name,
                        "color":appropiateColor.color,
                        "facility":Math.floor(Math.random() * 256)
                    };

                    cardObject.DistrictFreeObject.push(districtProperties[mapManager.prepareId(cardObject,value.id)]);
                    cardObject.districts[mapManager.prepareId(cardObject,value.id)] = districtProperties;

                    // creating geojson object
                    var Object = {
                        "type":"Feature",
                        "id":mapManager.prepareId(cardObject,value.id),
                        "properties":{
                            "name":value.properties
                        },
                        "geometry":{
                            "type":value.geometry.type,
                            "coordinates":value.geometry.coordinates
                        },
                        "style":{
                            fill:{
                                color:mapManager.getColorFromLocalStorage(mapManager.prepareId(cardObject,value.id)),
                                opacity:5
                            },
                            stroke:{
                                color:'white',
                                width:2
                            }
                        }
                    };
                    TotalGeo.features.push(Object);

                });

                angular.extend(cardObject, {
                    Africa: {
                        lat: -6.45,
                        lon: 35,
                        zoom: 5.6
                    },
                    layers:[
                        {
                            name:'mapbox',
                            source: {
                                type: 'TileJSON',
                                url:'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
                            }
                        } ,
                        {
                            name:'geojson',
                            source: {
                                type: 'GeoJSON',
                                geojson: {
                                    object: TotalGeo
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
                });

                cardObject.districts = {};

                angular.forEach(cardObject.DistrictFreeObject,function(data,index){
                    var district = data;
                    cardObject.districts[district['district_id']] = district;
                });



                olData.getMap().then(function(scope) {
                    var previousFeature;
                    var overlay = new ol.Overlay({
                        element: document.getElementById('districtbox'),
                        positioning: 'top-right',
                        offset: [100, -100],
                        position: [100, -100]
                    });
                    var overlayHidden = true;
                    // Mouse over function, called from the Leaflet Map Events
//                        $scope.$on('card.openlayers.layers.geojson.click', function(event, feature, olEvent) {
//
//                            $scope.$apply(function(scope) {
//                                console.log(card);
//                                if(feature) {
//                                    $scope.id = feature.getId();
//                                    scope.selectedDistrict = feature ? $scope.districts[feature.getId()]: '';
//                                }
//                            });
//                        });
//
//                        card.$on('openlayers.layers.geojson.mousemove', function(event, feature, olEvent) {
//                            console.log("abcd");
//                        });
//                        card.$on('openlayers.layers.geojson.featuresadded', function(event, feature, olEvent) {//
//                            $scope.$apply(function(scope) {
//                                if(feature) {
//                                    card.id = feature.getId();
//                        card.informationTooltip = feature ? card.districts[feature.getId()]: '';
//                                }
//                            });
//
//                        });
                });

                cardObject.closeTootip = function(){
                    cardObject.selectedDistrict = null;

                }
                cardObject.closeTootipHover = function(){
                    cardObject.selectedDistrictHover = null;

                }




            }).fail(function(response){

            });
        },
        prepareMapDataObject:function ( analyticsObject ) {

        },
        getColor:function(district,districtProperties){
            if(!district || !district['district_id']){
                return "#FFF";
            }

            var color = districtProperties[district['district_id']].color;
            return color;
        },
        getStyle:function(feature,districtProperties){
            var style = olHelpers.createStyle({
                fill:{
                    color:mapManager.getColor(mapManager.districts[feature.getId()]),
                    opacity:0.4
                },stroke:{
                    color:'white',
                    width:2
                }
            });

            return [ style ]
        },
        getMaxAndMin:function (card) {

            var count = card.length;
            var individuals = [];
            if(count==27){
                var array_of_data = "";
                angular.forEach(card[0].data,function(value,index){

                    if(index==card[0].data.length-1){
                        array_of_data = array_of_data+value;
                    }else{
                        array_of_data=array_of_data+value+",";
                    }

                });

                angular.forEach(card,function(value,index){

                    if(value.name.split(" ").indexOf("Region")>=0){
//                        if(index>1){
                        individuals.push(value);
//                        }
                    }


                });

                var max = Math.max.apply(Math, array_of_data.split(","));
                var min = Math.min.apply(Math, array_of_data.split(","));
                return [max,min,individuals];
            }else if(count==26){

                var array_of_data = "";
                angular.forEach(card[0].data,function(value,index){
                    console.log("Organisation Unit Council");
                    console.log(value);
                    if(index==card[0].data.length-1){
                        array_of_data = array_of_data+value;
                    }else{
                        array_of_data=array_of_data+value+",";
                    }

                });

                angular.forEach(card,function(value,index){
                    console.log("Organisation Unit regions");
                    console.log(value);
                    if(value.name.split(" ").indexOf("Region")>=0){
//                        if(index>1){
                        individuals.push(value);
//                        }
                    }


                });

                var max = Math.max.apply(Math, array_of_data.split(","));
                var min = Math.min.apply(Math, array_of_data.split(","));
                return [max,min,individuals];

            }else{
                var array_of_data = "";
                var individuals = [];
                angular.forEach(card[0].data,function(value,index){

                    if(index==card[0].data.length-1){
                        array_of_data = array_of_data+value;
                    }else{
                        array_of_data=array_of_data+value+",";
                    }

                });

                angular.forEach(card,function(value,index){

                    if(value.name.split(" ").indexOf("Council")>=0){
                        if(index>1){
                            individuals.push(value);
                        }
                    }

                });

                var max = Math.max.apply(Math, array_of_data.split(","));
                var min = Math.min.apply(Math, array_of_data.split(","));
                return [max,min,individuals];
            }
        },
        getLegend:function (input) {
            if(input){
                var legends = "";
                var max = parseInt(input[0]);
                var min = parseInt(input[1]);
                var data = input[2];
                var count = data.length;
                if(max==0){
                    max=1;
                }
                var mins='';
                if(min==0){
                    mins=0;
                }else{
                    mins="0-"+min
                }

                if(((max-min)/count)<1){
                    legends = [{set:mins+"",color:"#FF0000",classfy:"min",members:0},{set:min+" - "+((max+min)/2).toFixed(0),color:"#DEBE0C",classfy:"medium",members:0},{set:(max)+"+",color:"#2F8533",classfy:"max",members:0}];
                }else{
                    var intervals = ((max-min)/count).toFixed(0);
                    legends = [{set:mins+"",color:"#FF0000",classfy:"min",members:0},{set:min+" - "+((max+min)/2).toFixed(0),color:"#DEBE0C",classfy:"medium",members:0},{set:(max)+"+",color:"#2F8533",classfy:"max",members:0}];

                }
                return legends;
            }else{
                return false;
            }
        },
        decideOnColor:function(max_and_min,legend,value){
            var classfy = "";
            var i = 0;
            angular.forEach(max_and_min[2],function(valueL,indexL){
                if(value.id==valueL.id){ console.log(valueL.value);
                    i++;
                    if(valueL.value!=0&&valueL.value>=max_and_min[0]){
                        console.log("This is maximum legend is");
                        console.log(legend[2]);
                        legend[2].members=legend[2].members+1;
                        classfy = legend[2];
                        return false;
                    }

                    if(valueL.value!=0&&valueL.value<=((max_and_min[1]+max_and_min[0])/2)&&valueL.value>max_and_min[1]){
                        console.log("This is medium legend is");
                        console.log(legend[1]);
                        legend[1].members=legend[1].members+1;
                        classfy = legend[1];
                        return false;
                    }

                    if(valueL.value==0||valueL.value<=max_and_min[1]){
                        legend[0].members=legend[0].members+1;
                        classfy = legend[0];
                        return false;
                    }
                }else{
                    return false;
                }
            });
            return classfy;
        },
        prepareId: function(card,value,selectedPeriod,selectedUid){
            return card.data+"_"+value+"_"+selectedPeriod+"_"+selectedUid;
        }

    }
    return mapManager;
});
mainServices.factory('shared',function(){
            var shared = {
                "facility":0
            };
            return shared;
});
mainServices.factory('deleteManager',function($http,DHIS2URL,$q){
    var deleteManager = {
        deleteOptions:function(optionSet,objectives){
            var defer = $q.defer();
            var promises = [];
            var deleteManagerObject = this;
            angular.forEach(optionSet.options,function(option){
                if(!deleteManagerObject.optionExists(objectives,option)){
                    promises.push($http.delete(DHIS2URL+'/api/optionSets/'+optionSet.id+"/options/"+option.id));
                }
            });
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        },
        optionExists:function(pool,option){
            var exists = false;
            angular.forEach(pool,function(object){
                if(object.id && !exists)
                    if(object.id == option.id){
                        exists = true;
                    }
            });
            return exists;
        },
        deleteIndicators:function(indicatorGroup,objectives){
            var defer = $q.defer();
            var promises = [];
            angular.forEach(indicatorGroup.indicators,function(indicator){
                if(!deleteManagerObject.optionExists(objectives,indicator)){
                    promises.push($http.delete(DHIS2URL+'/api/indicatorGroups/'+indicatorGroup.id+"/indicators/"+indicator.id));
                }
            });
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        },
        deleteTargets:function(dataElementGroup){
            var defer = $q.defer();
            var promises = [];
            angular.forEach(dataElementGroup.dataElements,function(dataElement){
                promises.push($http.delete(DHIS2URL+'/api/dataElementGroups/'+dataElementGroup.id+"/dataElements/"+dataElement.id));
            });
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        }
    }
    return deleteManager;
});
mainServices.factory('Result',function($http,DHIS2URL,$q){
    function Result(resultData) {
        if(resultData){
            this.setData(resultData);
        }
        // Remaining initialisations
    };
    Result.prototype = {
        setData: function(resultData) {
            angular.extend(this, resultData);
        },
        save:function(resultSavedData){
            var deferred = $q.defer();
            $http.post(DHIS2URL+'/api/options.json',{"name":this.name,"code":this.sector}).then(function(optionResult2){
                // Link result with objective
                // Result option set.
                $http.post(DHIS2URL+'/api/optionSets/'+resultSavedData.data.response.lastImported+'/options/'+optionResult2.data.response.lastImported+'.json',null).then(function(optionSetResult){
                    deferred.resolve();
                },function(error){
                    deferred.reject(error);
                });
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
    return Result;
});
mainServices.factory('Indicator',function($http,DHIS2URL,Result,$q){

    function Indicator(objectData) {
        if(objectData){
            this.setData(objectData);
        }
        // Remaining initialisations
    };
    Indicator.prototype = {
        setData: function(indicatorData) {
            angular.extend(this, indicatorData);
            angular.forEach(this.attributeValues,function(attributeValue){

            });
            /*this.indicatorID = this.getAttribute("Indicator Outcome");
             if(this.indicatorID == ""){
             this.indicatorID = this.getAttribute("Indicator Result");
             }*/
            this.targetDataElement = this.getAttribute("Target Dataelement");
            this.baseline = this.getAttribute("Baseline");
        },
        getAttribute: function(attributeName){

            var value = "";
            angular.forEach(this.attributeValues,function(attributeValue){
                if(attributeValue.attribute.name == attributeName){
                    value = attributeValue.value;
                }
            });

            return value;
        },
        updateAttributeData: function() {
            this.setAttribute("Target Dataelement",this.targetDataElement);
            this.setAttribute("Baseline",this.baseline);
        },
        save:function(indicatorGroup){
            var defer = $q.defer();
            this.updateAttributeData();
            var indicatorObject = this;

            $http.post(DHIS2URL+'/api/indicatorGroups/'+indicatorGroup.id+
            '/indicators/'+this.id+'.json',{attributeValues:this.attributeValues}).then(function(data){

                indicatorObject.postUpdatedIndicatorAttributes();
                defer.resolve();
            },function(error){
                deferred.reject(error);
            });
            return defer.promise;
        },
        saveTarget:function(){
            this.updateAttributeData();
            return this.postUpdatedIndicatorAttributes();
        },
        update:function(){
            var defer = $q.defer();
            this.updateAttributeData();
            var indicatorObject = this;

            $http.put(DHIS2URL+'/api/indicators/'+this.id+'.json',this).then(function(data){

                indicatorObject.postUpdatedIndicatorAttributes().then(function(){
                    defer.resolve();
                },function(error){
                    defer.reject(error);
                });

            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        },
        setAttribute: function(attributeName,attributeValue) {
            var attributeDoesntExist=true;
            var indicatorObject = this;
            angular.forEach(this.attributeValues,function(existingAttributeValue){
                if(existingAttributeValue.attribute.name == attributeName){
                    existingAttributeValue.value=attributeValue;
                    attributeDoesntExist=false;
                }
            });
            if(attributeDoesntExist) {
                $http.get(DHIS2URL+'/api/attributes.json?paging=false&fields=id,name,code,created,lastUpdated&filter=indicatorAttribute:eq:true',indicatorObject)
                    .success(function(attributesData){
                        attributesData.attributes.forEach(function(attribute){
                            if(attribute.name==attributeName) {
                                if(angular.isUndefined(indicatorObject.attributeValues)) {
                                    indicatorObject.attributeValues=[];
                                }
                                var currentDate=(new Date()).toISOString();
                                indicatorObject.attributeValues.push({"lastUpdated":currentDate,"create":currentDate,"attribute":attribute,"value":attributeValue});
                            }
                        })
                    }).error(function(errorMessage){
                        console.log('Failed to load attributes in attempt to set value for saving');
                    })
            }
        },
        postUpdatedIndicatorAttributes: function () {
            var defer = $q.defer();
            var indicatorObject = this;
            if(!indicatorObject.attributeValues){
                defer.resolve();
                return defer.promise;
            }
            $http.get(DHIS2URL+'/api/indicators/'+this.id+'.json')
                .success(function(completeOrgunitGroup) {
                    // Go through the object changing attribute values and
                    // post it again

                    completeOrgunitGroup.attributeValues=[];
                    indicatorObject.attributeValues.forEach(function(attributeValueFromUser){
                        completeOrgunitGroup.attributeValues.push(attributeValueFromUser)
                    });
                    // Post the entire updated attribute object
                    $http.put(DHIS2URL+'/api/indicators/'+indicatorObject.id,completeOrgunitGroup).
                        success(function(data, status, headers, config) {
                            defer.resolve();
                        }).
                        error(function(data, status, headers, config) {
                            defer.resolve();
                            console.log("Error Saving Org:");
                        });
                }).error(function(error){
                    defer.reject(error);
                });
            return defer.promise;
        },
        loadIndicatorValue: function(period,orgunit) {
            var defer = $q.defer();
            var indicator = this;
            //http://localhost:8080/ims/api/analytics.json?dimension=dx:x7He7qxhPZR;zZcFTW3uGyL&dimension=pe:201508;201509;201510&filter=ou:VF5ziJ57UlJ&displayProperty=NAME&skipMeta=true
            var analyticsValuePromise = $http.get(DHIS2URL+'/api/analytics.json?dimension=dx:'+indicator.id+'&dimension=pe:'+period+'&filter=ou:'+orgunit+'&displayProperty=NAME&skipMeta=true')
                .success(function(dataValues){
                    var totalValue=0;
                    if(! angular.isUndefined(dataValues.rows)) {
                        dataValues.rows.forEach(function(dataValue){
                            totalValue=totalValue+Number(dataValue[2]);
                        })
                    }
                    indicator.indicatorValue=totalValue;
                    defer.resolve();
                })
                .error(function(errorMessageData){
                    defer.reject();
                    console.log(errorMessageData);
                });
        },
        loadTargetValue: function(period,orgunit) {
            var defer = $q.defer();
            var indicator = this;
            var target = indicator.targetDataElement;
            //http://localhost:8080/ims/api/analytics.json?dimension=dx:x7He7qxhPZR;zZcFTW3uGyL&dimension=pe:201508;201509;201510&filter=ou:VF5ziJ57UlJ&displayProperty=NAME&skipMeta=true
            var analyticsValuePromise = $http.get(DHIS2URL+'/api/analytics.json?dimension=dx:'+target+'&dimension=pe:'+period+'&filter=ou:'+orgunit+'&displayProperty=NAME&skipMeta=true')
                .success(function(dataValues){
                    var totalValue =0;
                    if(! angular.isUndefined(dataValues.rows)) {
                        dataValues.rows.forEach(function(dataValue){
                            totalValue=totalValue+Number(dataValue[2]);
                        })
                    }
                    indicator.targetValue=totalValue;
                    defer.resolve();
                })
                .error(function(errorMessageData){
                    defer.reject();
                    console.log(errorMessageData);
                });
        }
    }
    return Indicator;
});
mainServices.factory('Target',function($http,DHIS2URL,$q){

    function Target(objectData) {
        if(objectData){
            this.setData(objectData);
        }
        // Remaining initialisations
    };
    Target.prototype = {
        setData: function(indicatorData) {
            angular.extend(this, indicatorData);
            angular.forEach(this.attributeValues,function(attributeValue){

            });
        },
        updateAttributeData: function() {
            // this.setAttribute("Indicator Outcome",this.outcome.id);
            // this.setAttribute("Indicator Result",this.results.id);
            // this.setAttribute("Target
            // Dataelement",this.targetDataElement);
        },
        save:function(dataElementGroup){
            var defer = $q.defer();
            this.updateAttributeData();
            var targetObject = this;

            $http.post(DHIS2URL+'/api/dataElementGroups/'+dataElementGroup.id+
            '/dataElements/'+this.id+'.json',{attributeValues:this.attributeValues}).then(function(result){
                // targetObject.postUpdatedIndicatorAttributes();
                $http.get(DHIS2URL+'/api/dataElements/'+targetObject.id+'.json').then(function(result2){
                    defer.resolve(result2);
                },function(error){
                    defer.reject(error);
                });

            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        },
        setAttribute: function(attributeName,attributeValue) {
            var attributeDoesntExist=true;
            var indicatorObject = this;
            angular.forEach(this.attributeValues,function(existingAttributeValue){
                if(existingAttributeValue.attribute.name == attributeName){
                    existingAttributeValue.value=attributeValue;
                    attributeDoesntExist=false;
                }
            });
            if(attributeDoesntExist) {
                $http.get(DHIS2URL+'/api/attributes.json?paging=false&fields=id,name,code,created,lastUpdated&filter=dataElementAttribute:eq:true',indicatorObject)
                    .success(function(attributesData){
                        attributesData.attributes.forEach(function(attribute){
                            if(attribute.name==attributeName) {
                                if(angular.isUndefined(indicatorObject.attributeValues)) {
                                    indicatorObject.attributeValues=[];
                                }
                                var currentDate=(new Date()).toISOString();
                                indicatorObject.attributeValues.push({"lastUpdated":currentDate,"create":currentDate,"attribute":attribute,"value":attributeValue});
                            }
                        })
                    }).error(function(errorMessage){
                        console.log('Failed to load attributes in attempt to set value for saving');
                    })
            }
        },
        postUpdatedIndicatorAttributes: function (indicatorObject) {
            var indicatorObject = this;
            $http.get(DHIS2URL+'/api/dataElements/'+this.id+'.json')
                .success(function(completeOrgunitGroup) {
                    // Go through the object changing attribute values and
                    // post it again
                    completeOrgunitGroup.attributeValues=[];
                    indicatorObject.attributeValues.forEach(function(attributeValueFromUser){
                        completeOrgunitGroup.attributeValues.push(attributeValueFromUser)
                    });
                    // Post the entire updated attribute object
                    $http.put(DHIS2URL+'/api/dataElements/'+indicatorObject.id,completeOrgunitGroup).
                        success(function(data, status, headers, config) {
                        }).
                        error(function(data, status, headers, config) {
                            console.log("Error Saving Org:");
                        });
                });
        }
    }
    return Target;
});
mainServices.factory('Objective',function($http,DHIS2URL,Result,$q,Indicator,Target){
    function Objective(objectiveData) {
        if(objectiveData){
            this.setData(objectiveData);
        }
        // Remaining initialisations
    };
    Objective.prototype = {
        setData: function(objectiveData) {
            angular.extend(this, objectiveData);
            //this.loadIndicatorTarget();
            this.results = [];
        },
        getIndicatorFilter:function(){
            return "filter=name:eq:Outcome_" + this.id;
        },
        loadIndicatorTarget:function(){
            var deferred = $q.defer();
            if(this.projectID){
                var objectiveObject = this;
                objectiveObject.indicators = [];
                $http.get(DHIS2URL+'/api/indicatorGroups.json?paging=false&fields=indicators[:all]&' + this.getIndicatorFilter())
                    .then(function(result){
                        result.data.indicatorGroups[0].indicators.forEach(function(indicator){
                            objectiveObject.indicators.push(new Indicator(indicator));
                        });
                        deferred.resolve();
                    },function(error){
                        deferred.reject(error);
                    });
            }else {
                deferred.resolve();
            }
            return deferred.promise;

        },
        initiateComponents:function(){
            var deferred = $q.defer();
            var objectiveObject = this;
            this.loadIndicatorTarget().then(function(){
                $http.get(DHIS2URL+'/api/optionSets.json?paging=false&fields=:all&filter=name:eq:Result_' +objectiveObject.id).then(function(results2){
                    if(results2.data.optionSets.length > 0){
                        angular.forEach(results2.data.optionSets[0].options,function(option2){
                            objectiveObject.addResult({id:option2.id,name:option2.name,sector:option2.code,projectID:objectiveObject.projectID});
                        });
                    }
                    deferred.resolve();
                },function(error){
                    deferred.reject(error);
                })
            });
            return deferred.promise;
        },
        setTarget:function(targetID){
            var targetObject = this;
            $http.get(DHIS2URL+'/api/dataElements/'+targetID+'.json?paging=false&fields=:all')
                .then(function(result){
                    targetObject.target = new Target(result.data);
                });


        },
        initializeIndicatorTarget: function(){

            this.indicators = [];
        },
        saveIndicators:function(){
            var deferred = $q.defer();
            var promises = [];
            var objectiveObject = this;
            var newIndicator = [];
            objectiveObject.indicators.forEach(function(indicator){
                newIndicator.push(new Indicator(indicator));
            });
            this.indicators = newIndicator;
            $http.get(DHIS2URL+'/api/indicatorGroups.json?filter=name:eq:Outcome_' + this.id)
                .success(function(result){
                    objectiveObject.indicators.forEach(function(indicator){
                        indicator = new Indicator(indicator);
                        promises.push(indicator.save(result.indicatorGroups[0]));
                    });
                    objectiveObject.results.forEach(function(result){
                        promises.push(result.saveIndicators());
                    });
                    $q.all(promises).then(function(){
                        deferred.resolve();
                    },function(error){
                        deferred.reject(error);
                    });
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },
        saveTarget:function(){
            var deferred = $q.defer();
            var promises = [];
            this.indicators.forEach(function(indicator){
                promises.push(indicator.saveTarget());
            })
            this.results.forEach(function(result){
                promises.push(result.saveTarget());
            })
            $q.all(promises).then(function(){
                deferred.resolve();
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        addResult:function(result){
            var resultObject = new Result(result);
            resultObject.initializeIndicatorTarget();
            var objectiveObject = this;
            resultObject.initiateComponents().then(function(){
                objectiveObject.results.push(resultObject);
            });
        },
        loadAllIndicators:function(){
            var deferred = $q.defer();
            $http.get(DHIS2URL+'/api/indicators.json?paging=false')
                .success(function(projectData){
                    // @todo convert projectData into data black bird data
                    // structure before persistance;
                    var project = thisProjectManager._retrieveInstance(projectData.id,projectData);
                    deferred.resolve(project);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },
        save:function(optionSet){
            if(this.id){
                return this.updateObjective(optionSet);
            }else{
                return this.postObjective(optionSet);
            }
        },
        postObjective:function(optionSet){
            var deferred = $q.defer();
            var promises = [];
            var objectiveObject = this;
            $http.post(DHIS2URL+'/api/options.json',{"name":this.name,"code":this.sector}).then(function(optionResult){
                console.log(objectiveObject);
                objectiveObject.id = optionResult.data.response.lastImported;
                objectiveObject.initializeIndicatorTarget();
                if(!optionSet.id){
                    optionSet.id = optionSet.data.response.lastImported;
                }
                // Linking objective to option set
                promises.push($http.post(DHIS2URL+'/api/optionSets/'+optionSet.id+'/options/'+optionResult.data.response.lastImported+'.json',null).then(function(res){

                }));
                promises.push($http.post(DHIS2URL+'/api/indicatorGroups.json',{"name":"Outcome_" + objectiveObject.id}));
                var resultName = "Result_" + optionResult.data.response.lastImported;
                // Create option set for results associated
                // with objective/outcome
                $http.post(DHIS2URL+'/api/optionSets.json',{"name":resultName}).then(function(resultSavedData){
                    // Loop throght objective results
                    angular.forEach(objectiveObject.results,function(objectiveResult){
                        promises.push(objectiveResult.save(resultSavedData));

                    });
                    $q.all(promises).then(function(){
                        deferred.resolve();
                    },function(error){
                        deferred.reject(error);
                    });

                },function(error){
                    deferred.reject(error);
                });

            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        updateObjective:function(optionSet){
            var deferred = $q.defer();
            var promises = [];
            var objectiveObject = this;
            $http.put(DHIS2URL+'/api/options/'+this.id+'.json',{"name":this.name,"code":this.sector}).then(function(optionResult){
                if(!optionSet.id){
                    optionSet.id = optionSet.data.response.lastImported;
                }
                $http.get(DHIS2URL+'/api/optionSets.json?paging=false&filter=name:eq:Result_'+objectiveObject.id).then(function(resultSavedData){
                    angular.forEach(objectiveObject.results,function(objectiveResult){
                        promises.push(objectiveResult.save(resultSavedData.data.optionSets[0]));

                    });
                    $q.all(promises).then(function(){
                        deferred.resolve();
                    },function(error){
                        deferred.reject(error);
                    });
                },function(error){
                    deferred.reject(error);
                });
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
    Result.prototype = new Objective();
    return Objective;
});
mainServices.factory('targetsManager',function($http,$q,Indicator,DHIS2URL){
    var targetsManager = {
        _pool: {},
        _targetObjectName: "dataElements",
        _retrieveInstance: function(projectId,projectData){
            var instance = this._pool[projectId];
            if(instance){
                instance.setData(projectData);
            }else {
                instance = new Indicator(projectData);
                //instance.initAttributeData();
                this._pool[projectId] = instance;
            }

            return instance;
        },
        loadAllTargets: function() {
            var deferred = $q.defer();
            var thisTargetManager = this;
            $http.get(DHIS2URL+'/api/dataElements.json?paging=false&filter=domainType:eq:AGGREGATE&paging=false')
                .success(function(indicatorsData){
                    var indicators = [];
                    indicatorsData[thisTargetManager._targetObjectName].forEach(function(indicatorData){
                        // @todo convert project data into black bird data
                        // structure before persistance;
                        var indicator = thisTargetManager._retrieveInstance(indicatorData.id,indicatorData);
                        indicators.push(indicator);
                    });
                    deferred.resolve(indicators);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        }
    }
    return targetsManager;
});
mainServices.factory('indicatorsManager',function($http,$q,Indicator,DHIS2URL,projectObjectName){
    var indicatorsManager = {
        _pool: {},
        _indicatorObjectName: "indicators",
        _retrieveInstance: function(indicatorId,indicatorData){
            var instance = this._pool[indicatorId];
            if(instance){
                instance.setData(indicatorData);
            }else {
                instance = new Indicator(indicatorData);
                this._pool[indicatorId] = instance;
            }

            return instance;
        },
        loadAllIndicators: function() {
            var deferred = $q.defer();
            var thisIndicatorManager = this;
            $http.get(DHIS2URL+'/api/indicators.json?paging=false')
                .success(function(indicatorsData){
                    var indicators = [];
                    indicatorsData[thisIndicatorManager._indicatorObjectName].forEach(function(indicatorData){
                        // @todo convert project data into black bird data
                        // structure before persistance;
                        var indicator = thisIndicatorManager._retrieveInstance(indicatorData.id,indicatorData);
                        indicators.push(indicator);
                    });
                    deferred.resolve(indicators);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },
        getIndicator: function(indicator) {
            var deferred = $q.defer();
            var thisIndicatorManager = this;
            $http.get(DHIS2URL+'/api/indicators/'+indicator.id+'/.json?paging=false')
                .success(function(indicatorData){
                    var indicatorReturn = thisIndicatorManager._retrieveInstance(indicatorData.id,indicatorData);
                    deferred.resolve(indicatorReturn);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        }
    }
    return indicatorsManager;
});
mainServices.factory('Project',function($http,DHIS2URL,Objective,$q,deleteManager,Indicator){
    function Project(projectData) {
        if(projectData){
            this.setData(projectData);
        }else{
            this.objectives = [];
        }
        // Remaining initialisations
    };
    Project.prototype = {
        setData: function(projectData) {
            angular.extend(this, projectData);
            //return this.initAttributeData();
        },
        initAttributeData: function() {
            this.donor = this.getAttribute("Project Donor");
            this.grantId = this.getAttribute("Grant ID");
            this.grantStatus = this.getAttribute("Grant Status");
            this.goal = this.getAttribute("Goal");
            this.sector = this.getAttribute("Sector");
            this.startDate = this.getDate(this.getAttribute("Project Start Date"));
            this.endDate = this.getDate(this.getAttribute("Project End Date"));
            this.projectName = this.getAttribute("Project Name");
            this.areaOfOperation = this.getAttribute("Area of Operation");
            this.objectives = [];
            var projectObject = this;
            var defer = $q.defer();
            var promises = [];
            $http.get(DHIS2URL+'/api/optionSets.json?paging=false&fields=:all&filter=name:eq:Outcome_' +this.id).then(function(results){
                if(results.data.optionSets.length > 0){
                    angular.forEach(results.data.optionSets[0].options,function(option){
                        var objective = new Objective({
                            id:option.id,name:option.name,
                            sector:option.code,projectID:projectObject.id});
                        promises.push(objective.initiateComponents());
                        projectObject.objectives.push(objective);
                    });

                }
                $q.all(promises).then(function(){
                    defer.resolve();
                },function(error){
                    defer.reject(error);
                });
            },function(error){
                defer.reject(error);
            });

            return defer.promise;
        },
        getDate:function(dateString){
            return new Date(dateString);
            //return angular.isUndefined(dateString) ? null : new Date(parseInt(dateString.substr(0,4)),parseInt(dateString.substr(5,2)),parseInt(dateString.substr(8,2)));
        },
        addObjective:function(objective){
            var objectiveObject = new Objective(objective);
            objectiveObject.initializeIndicatorTarget();
            this.objectives.push(objectiveObject);
        },
        updateAttributeData:function(){
            this.setAttribute("Project Donor",this.donor);
            this.setAttribute("Grant Status",this.grantStatus);
            this.setAttribute("Goal",this.goal);
            this.setAttribute("Sector",this.sector);
            this.setAttribute("Project Start Date",this.startDate);
            this.setAttribute("Project End Date",this.endDate);
            this.setAttribute("Project Name",this.projectName);
            this.setAttribute("Area of Operation",this.areaOfOperation);
        },
        removeObjective:function(index){

            this.objectives.splice(index,1);
        },
        save: function(data,orgUnits){

            var defer = $q.defer();
            var promises = [];

            this.updateAttributeData();
            var projectObject = this;

            $http.post(DHIS2URL+'/api/organisationUnitGroups.json',this).success(function(organisationUnitGroupData){
                projectObject.id = organisationUnitGroupData.response.lastImported;
                // Start sending attributes
                if(projectObject.id){

                    projectObject.postUpdatedProjectAttributes(projectObject);
                    promises.push($http.post(DHIS2URL+'/api/optionSets.json',{"name":"Outcome_" + projectObject.id}));
                    promises.push($http.post(DHIS2URL+'/api/dataElementGroups.json',{"name":"Outcome_" + projectObject.id}));
                    /*angular.forEach(projectObject.orgaUnits,function(orgUnit){
                     promises.push($http.post(DHIS2URL+'/api/organisationUnitGroups/'+organisationUnitGroupData.response.lastImported+'/organisationUnits/'+orgUnit.id+'.json',null));
                     });*/
                    $q.all(promises).then(function(){
                        defer.resolve();
                    },function(error){
                        defer.reject(error);
                    });
                }else{
                    defer.reject("Project Grant ID Already Exists!");
                }

            }).error(function(error){
                defer.reject();
            });
            return defer.promise;
        },
        saveObjectives: function(){
            var defer = $q.defer();
            var promises = [];
            var projectObject = this;
            var outcomeName = "Outcome_" + projectObject.id;
            $http.get(DHIS2URL+'/api/optionSets.json?paging=false&fields=id,name,options&filter=name:eq:'+outcomeName).then(function(optionSetsResult){
                angular.forEach(optionSetsResult.data.optionSets,function(optionSet){
                    if(optionSet.name == outcomeName){

                        deleteManager.deleteOptions(optionSet,projectObject.objectives).then(function(){

                            angular.forEach(projectObject.objectives,function(objective){
                                // Saving Objective
                                promises.push(objective.save(optionSet));
                            });
                            $q.all(promises).then(function(){
                                defer.resolve();
                            },function(error){
                                defer.reject(error);
                            });
                        },function(error){
                            defer.reject(error);
                        });

                    }
                });
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        },

        saveIndicators:function(){
            var defer = $q.defer();
            var promises = [];
            angular.forEach(this.objectives,function(objective){
                promises.push(objective.saveIndicators());

            });
            $q.all(promises).then(function(){
                defer.resolve();
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        },
        saveTargets:function(){
            var defer = $q.defer();
            var promises = [];

            var projectObject = this;
            var targetName = "Outcome_" + projectObject.id;
            $http.get(DHIS2URL+'/api/dataElementGroups.json?paging=false&filter=name:eq:'+targetName).then(function(dataElementGroupsResult){
                angular.forEach(dataElementGroupsResult.data.dataElementGroups,function(dataElementGroup){
                    if(dataElementGroup.name == targetName){
                        deleteManager.deleteTargets(dataElementGroup).then(function(){
                            angular.forEach(projectObject.objectives,function(objective){
                                promises.push(objective.saveTarget(dataElementGroup));

                                angular.forEach(objective.results,function(result){
                                    if(result.target){
                                        promises.push($http.post(DHIS2URL+'/api/dataElementGroups/'+dataElementGroup.id+
                                        '/dataElements/'+result.target.id+'.json',null));
                                    }
                                });
                                $q.all(promises).then(function(){
                                    defer.resolve();
                                },function(error){
                                    defer.reject(error);
                                });
                            });
                        },function(error){
                            defer.reject(error);
                        });
                    }
                });
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        },
        update: function(data,orgUnits){
            var defer = $q.defer();
            var promises = [];

            this.updateAttributeData();

            var projectObject = this;
            projectObject.updateAttributeData();
            $http.put(DHIS2URL+'/api/organisationUnitGroups/'+this.id+'.json',this).success(function(organisationUnitGroupData){
                projectObject.id = organisationUnitGroupData.response.lastImported;
                // Start sending attributes
                projectObject.postUpdatedProjectAttributes(projectObject);
                projectObject.deleteOrgUnits().then(function(){
                    angular.forEach(orgUnits,function(orgUnit){
                        promises.push($http.post(DHIS2URL+'/api/organisationUnitGroups/'+organisationUnitGroupData.response.lastImported+'/organisationUnits/'+orgUnit.id+'.json',null));
                    });
                    $q.all(promises).then(function(){
                        defer.resolve();
                    },function(error){
                        defer.reject(error);
                    });
                });
            }).error(function(error){
                defer.reject();
            });
            return defer.promise;
        },
        deleteOrgUnits:function(){
            var defer = $q.defer();
            var promises = [];
            var projectObject = this;
            $http.get(DHIS2URL+'/api/organisationUnitGroups/'+projectObject.id+'/organisationUnits.json',null).
                then(function(attributeResults){
                    angular.forEach(attributeResults.data.organisationUnits,function(orgUnit){
                        promises.push($http.delete(DHIS2URL+'/api/organisationUnitGroups/'+
                        projectObject.id+'/organisationUnits/'+orgUnit.id+'.json',null));
                    });
                    $q.all(promises).then(function(){
                        defer.resolve();
                    },function(error){
                        defer.reject(error);
                    });
                },function(error){
                    defer.reject(error);
                });

            return defer.promise;
        },
        getAttribute: function(attributeName){

            var value = "";
            angular.forEach(this.attributeValues,function(attributeValue){
                if(attributeValue.attribute.name == attributeName){
                    value = attributeValue.value;
                }
            });

            return value;
        },
        setAttribute: function(attributeName,attributeValue) {
            var attributeDoesntExist=true;
            var projectObject = this;
            angular.forEach(this.attributeValues,function(existingAttributeValue){
                if(existingAttributeValue.attribute.name == attributeName){
                    existingAttributeValue.value=attributeValue;
                    attributeDoesntExist=false;
                }
            });
            if(attributeDoesntExist) {
                $http.get(DHIS2URL+'/api/attributes.json?paging=false&fields=id,name,code,created,lastUpdated&filter=organisationUnitGroupAttribute:eq:true',projectObject)
                    .success(function(attributesData){
                        attributesData.attributes.forEach(function(attribute){
                            if(attribute.name==attributeName) {
                                if(angular.isUndefined(projectObject.attributeValues)) {
                                    projectObject.attributeValues=[];
                                }
                                var currentDate=(new Date()).toISOString();
                                projectObject.attributeValues.push({"lastUpdated":currentDate,"create":currentDate,"attribute":attribute,"value":attributeValue});
                            }
                        })
                    }).error(function(errorMessage){
                        console.log('Failed to load attributes in attempt to set value for saving');
                    })
            }
        },
        getGrantStatus: function() {
            return this.getAttribute("Grant Status");
        },
        delete: function(){
            return $http.delete(DHIS2URL+'/api/'+projectObjectName+'/' + this.id);
        },
        postUpdatedProjectAttributes: function (projectObject) {
            $http.get(DHIS2URL+'/api/organisationUnitGroups/'+projectObject.id+'.json')
                .success(function(completeOrgunitGroup) {
                    // Go through the object changing attribute values and
                    // post it again
                    completeOrgunitGroup.attributeValues=[];
                    projectObject.attributeValues.forEach(function(attributeValueFromUser){
                        completeOrgunitGroup.attributeValues.push(attributeValueFromUser)
                    });
                    // Post the entire updated attribute object
                    $http.put(DHIS2URL+'/api/organisationUnitGroups/'+projectObject.id,completeOrgunitGroup).
                        success(function(data, status, headers, config) {

                        }).
                        error(function(data, status, headers, config) {
                            console.log("Error Saving Org:");
                        });
                });
        }
    };
    return Project;
});
mainServices.factory('projectsManager',['$http','$q','Project','DHIS2URL','projectObjectName',function($http,$q,Project,DHIS2URL,projectObjectName){

    var projectsManager = {
        _pool: {},
        _locationObjectName: "organisationUnits",
        _retrieveInstance: function(projectId,projectData){
            var instance = this._pool[projectId];
            if(instance){
                instance.setData(projectData);
            }else {
                instance = new Project(projectData);
                instance.initAttributeData();
                this._pool[projectId] = instance;
            }

            return instance;
        },
        _search: function(projectId) {
            return this._pool[projectId];
        },
        _load: function(projectId,deferred){
            var thisProjectManager = this;
            var deferred = $q.defer();
            $http.get(DHIS2URL+'/api/'+projectObjectName+'/'+projectId+'.json?paging=false&fields=id,name,code,shortName,created,lastUpdated,organisationUnitGroupSet,organisationUnits,attributeValues')
                .success(function(projectData){
                    // @todo convert projectData into data black bird data structure
                    // before persistance;
                    var project = thisProjectManager._retrieveInstance(projectData.id,projectData);
                    deferred.resolve(project);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },

        /* public Methods */
        /* Use this function in order to get a project instance by it's id */
        getProject: function(projectId) {
            var deferred = $q.defer();
            var project = this._search(projectId);
            if(project){
                deferred.resolve(project)
            }else {
                return this._load(projectId,deferred);
                //deferred.resolve(this._load(projectId,deferred));
            }
            return deferred.promise;
        },
        getOrganisationUnits:function(){
            var deferred = $q.defer();
            $http.get(DHIS2URL + "/api/organisationUnits.json?filter=level:eq:1&paging=false&fields=id,name,children[id,name,children[id,name,children[id,name,children[id,name,children[id,name]]]]]")
                .then(function(results){
                    deferred.resolve(results.data.organisationUnits);
                },function(error){
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        getOptionSets:function(){
            var deferred = $q.defer();
            $http.get(DHIS2URL + "/api/optionSets.json?fields=:all").then(function(results){
                var data = {

                };
                angular.forEach(results.data.optionSets,function(optionSet){
                    if(optionSet.name == "Donor List"){
                        data.donors = optionSet.options;
                    }
                });
                angular.forEach(results.data.optionSets,function(optionSet){
                    if(optionSet.name == "Grant Status"){
                        data.grantStatusOptions = optionSet.options;
                    }
                });
                deferred.resolve(data);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        loadAllProjects: function() {
            var deferred = $q.defer();
            var thisProjectManager = this;
            $http.get(DHIS2URL+'/api/'+projectObjectName+'.json?paging=false&fields=id,name,code,shortName,created,lastUpdated,organisationUnitGroupSet,organisationUnits,attributeValues')
                .success(function(projectsData){
                    var projects = [];
                    projectsData[projectObjectName].forEach(function(projectData){
                        // @todo convert project data into black bird data
                        // structure before persistance;
                        var project = thisProjectManager._retrieveInstance(projectData.id,projectData);
                        projects.push(project);
                    });
                    deferred.resolve(projects);
                })
                .error(function(errorMessageData){
                    deferred.reject();
                });
            return deferred.promise;
        },
        loadAllAttributes:function(){
            var deferred = $q.defer();
            $http.get(DHIS2URL+'/api/attributes.json').then(function(result){
                deferred.resolve(result.data.attributes);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        /* Update project instance */
        setProject: function(projectData){
            var thisProjectManager = this;
            var project = this._search(projectData.id);
            if(project) {
                project.setData(projectData);
            }else {
                project = thisProjectManager._retrieveInstance(projectData);
            }
            return project;
        },
        loadAllLocations: function() {
            var deferred = $q.defer();
            var thisProjectManager = this;
            /* Deduce countries with organisation units of loaded projects */
            projectsManager.loadAllProjects().then(function(projects){
                var locationsIndex = [];
                var locations = {};
                projects.forEach(function(project){
                    project[thisProjectManager._locationObjectName].forEach(function(locationData){
                        // Extend locations with project attributes
                        var projectData = {};
                        projectData.name=project.name;
                        projectData.id=project.id;
                        projectData.attributeValues=project.attributeValues;

                        // Keep index to for keeping track of existing record to
                        // update project list
                        // and non-existent record to add in the index
                        if(locationsIndex.indexOf(locationData.id)==-1) {
                            // Non existent location
                            var structuredLocation = {};

                            structuredLocation.id=locationData.id,
                                structuredLocation.name = locationData.name,

                                // Classify by active/inactive/closed grant status
                                structuredLocation.activeGrants=[];
                            structuredLocation.inactiveGrants=[];
                            structuredLocation.closedGrants=[];
                            // Find grant status attribute to determine category
                            // the project fits in
                            projectData.attributeValues.forEach(function(attributeValue){
                                if(attributeValue.attribute.name=="Grant Status") {
                                    // Assign the project to respective grant
                                    // status based on value
                                    if(attributeValue.value=="Closed") {
                                        structuredLocation.closedGrants.push(projectData);
                                    }else if(attributeValue.value=="Inactive") {
                                        structuredLocation.inactiveGrants.push(projectData);
                                    }else if(attributeValue.value="Active") {
                                        structuredLocation.activeGrants.push(projectData);
                                    }
                                }
                            })

                            structuredLocation.projects = [],
                                structuredLocation.projects.push(projectData);


                            locations[locationData.id]=structuredLocation;
                            locationsIndex.push(locationData.id);
                        }else {
                            // Existent location
                            if(locations[locationData.id].projects.indexOf(projectData)==-1) {
                                // if This project isn't in the list, append it
                                locations[locationData.id].projects.push(projectData);
                            }
                        }
                    })
                });
                deferred.resolve(locations);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        loadAllProjectByOrganisationUnit:function(orgUnitId){
            var deferred = $q.defer();
            var fields = 'id,name,organisationUnitGroups[:all],children[id,name,organisationUnitGroups[:all],children[id,name,organisationUnitGroups[:all],children[id,name,organisationUnitGroups[:all],children[id,name,organisationUnitGroups[:all],children[id,name,organisationUnitGroups[:all]]]]]]';
            if(orgUnitId){
                $http.get(DHIS2URL+'/api/organisationUnits/'+orgUnitId+'.json?fields=' + fields).then(function(result){
                    deferred.resolve(result.data);
                },function(error){
                    deferred.reject(error);
                });
            }else{
                $http.get(DHIS2URL+'/api/organisationUnits.json?filter=level:eq:2&fields=' + fields).then(function(result){
                    deferred.resolve(result.data.organisationUnits);
                },function(error){
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        },
        loadProjectByLocation: function(locationId){
            var deferred = $q.defer();
            var thisProjectManager = this;
            /* Deduce projects of loaded locationId */
            projectsManager.loadAllProjects().then(function(projects){
                var projectsByLocation = [];
                projects.forEach(function(project){
                    project[thisProjectManager._locationObjectName].forEach(function(locationData){
                        if(locationData.id==locationId) {
                            projectsByLocation.push(project);
                        }
                    })
                });
                deferred.resolve(projectsByLocation);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        loadLocation: function(locationId) {
            var deferred = $q.defer();
            var thisProjectManager = this;
            /* Deduce location */
            thisProjectManager.loadAllLocations().then(function(locations){

                var filteredLocation = null;
                angular.forEach(locations,function(location){
                    if(location.id==locationId) {
                        filteredLocation=location;
                    }
                });

                deferred.resolve(filteredLocation);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
    };
    return projectsManager;
}]);
mainServices.factory('searchService',function($q,projectsManager,$timeout){
    var searchService = {
        search: function(val,deffered) {
            deffered.resolve();
            deffered = $q.defer();
            projectsManager.getProjects().then(function(projects) {
                var projectsReturned = [];
                angular.forEach(projects,function(project){
                    if(project.name.indexOf(val) != -1){
                        projectsReturned.push(project);
                    }
                });
                deffered.resolve(projectsReturned);
            },function(error){
                deferred.reject(error);
            });
            return deffered.promise;
        }
    }

    return searchService;
});
mainServices.factory('reportService', function ($q) {
    var reportService = {
        getMonths: function (startDateObj, endDateObj) {
            var startDate = moment(startDateObj);
            var endDate = moment(endDateObj).endOf("month");

            var allMonthsInPeriod = [];

            while (startDate.isBefore(endDate)) {
                allMonthsInPeriod.push(startDate.format("YYYYMM"));
                startDate = startDate.add(1, "month");
            }
            return allMonthsInPeriod;
        }
    };

    return reportService;
});
