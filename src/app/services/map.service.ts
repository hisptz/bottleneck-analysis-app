import {Injectable} from '@angular/core';
import {Color} from "./color";
import {VisualizationStore} from "./visualization-store";
import {AnalyticsService} from "./analytics.service";
import {VisualizerService} from "./visualizer.service";
import {Http, Response} from "@angular/http";
import {Constants} from "./constants";
import {Visualization} from "../model/visualization";
import {Observable} from "rxjs";
import {MapConfiguration} from "../model/map-configuration";

module colorModule {
  export class Color {
    constructor(public red: number, public green: number, public blue: number) {
    }

    private coll: Array<any> = [this.red, this.green, this.blue];
    private valid = this.colorIsVerid(this.coll);
    private text = this.colorText(this.coll, 'hex');
    private bg = this.colorText(this.coll, 'hex');


    colorIsVerid(colorSectionList) {
      let isValid = 'n';
      if ((!isNaN(colorSectionList[0])) && (!isNaN(colorSectionList[1])) && (!isNaN(colorSectionList[2]))) {
        isValid = 'y'
      }
      return isValid;
    }

    colorText(colorSectionList: Array<any>, colorFormat: String) {
      let base: number = 0;
      let denominator: number = 1;
      let result: String = '';

      if (colorFormat == 'hex') {
        base = 16;
      }

      colorSectionList.forEach((colorSection, colorSectionIndex) => {
        let colorSectionSegment = Math.round(colorSection / denominator);
        let colorSegmentString = colorSectionSegment.toString(base);

        if (colorFormat == 'hex' && colorSegmentString.length < 2) {
          colorSegmentString = '0' + colorSegmentString;
        }
        result = result + colorSegmentString;
      })

      if (colorFormat == 'hex') {
        result = '#' + result.toUpperCase();
      }
      return result;
    }

  }
}

interface Legend {
  htmlLegend: Object;
  scriptLegend: Array<Object>;
}

interface LegendItem {
  layerId: string;
  name: string;
  description: string;
  pinned: boolean;
  useIcons: boolean;
  opacity: number;
  layer: string;
  classes: Array<Object>;
  change: Array<Object>;
}

interface Class {
  name: string;
  label: string;
  description: string;
  collapse: string;
  min: number;
  max: number;
  color: string;
  icon: "",
  radius: number;
  count: number;
}

interface Change {
  name: string,
  description: string,
  changeFact: string,
  icon: string,
  threshold: number,
}
@Injectable()
export class MapService {


  private colorHigh: String;
  private colorLow: String;
  private colorType: String = "Hex";
  private ends: Array<any> = [Color, Color];
  private step: Array<any> = [];
  public mapLegend: any = {scriptLegenumbernd: [], htmlLegend: ""};


  constructor(private visualizationStore: VisualizationStore,
              private analyticsService: AnalyticsService,
              private visualizationService: VisualizerService,
              private http: Http,
              private constant: Constants) {
  }

  public getSanitizedMapData(mapData: Visualization, customFilters): Observable<Visualization> {
    return Observable.create(observer => {
      let mapDataFromStore = this.visualizationStore.find(mapData.id);
      if (mapDataFromStore != null) {
        if (mapDataFromStore.type != 'MAP') {
          let convertedSettings = [];

          /**
           * Check if layer has map configuration
           */
          if (!mapDataFromStore.details.hasOwnProperty('mapConfiguration')) {
            mapDataFromStore.details.mapConfiguration = this._getMapConfiguration({});
          }

          mapDataFromStore.layers.forEach(layer => {
            this._convertToMapType(layer.settings).subscribe(mapSettings => {

              /**
               * Prepare to update operating layers
               */
              if (mapSettings.length > 0) {
                mapSettings.forEach(mapLayer => {
                  convertedSettings.push(mapLayer);
                })
              }
            });
          });

          let totalRequestCount: number = convertedSettings.length;
          let requestCount: number = 0;
          let settingCount: number = 0;
          convertedSettings.forEach(setting => {
            settingCount++;
            setting.layer = 'thematic' + settingCount;
            Observable.forkJoin(
              this.analyticsService.getAnalytics(setting, 'MAP', customFilters),
              this._getGeoFeatures(setting)
            ).subscribe(result => {
              requestCount++;
              setting.geoFeatures = result[1];

              mapDataFromStore.operatingLayers.push({
                settings: setting,
                analytics: result[0]
              });

              if (totalRequestCount == requestCount) {
                /**
                 * Also save in visualization store
                 */
                this.visualizationStore.createOrUpdate(mapDataFromStore);

                /**
                 * Return the sanitized data back to chart service
                 */
                observer.next(mapDataFromStore);
                observer.complete();
              }
            })
          })
        } else {
          observer.next(mapDataFromStore);
          observer.complete();
        }

        /**
         * Also update in visualization store
         */
        this.visualizationStore.createOrUpdate(mapDataFromStore);

        /**
         * Return the sanitized data back to chart service
         */
        observer.next(mapDataFromStore);
        observer.complete();

      } else {
        if (mapData.details.hasOwnProperty('favorite')) {
          let favoriteType = mapData.details.favorite.hasOwnProperty('type') ? mapData.details.favorite.type : null;
          let favoriteId = mapData.details.favorite.hasOwnProperty('id') ? mapData.details.favorite.id : null;
          /**
           * Check if favorite has required parameters for favorite call
           */
          if (favoriteType != null && favoriteId != null) {
            this.http.get(this.constant.api + favoriteType + 's/' + favoriteId + '.json?fields=id,user,displayName~rename(name),longitude,latitude,zoom,basemap,mapViews[*,columns[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],rows[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],filters[dimension,filter,items[dimensionItem,dimensionItemType,displayName]],dataDimensionItems,program[id,displayName],programStage[id,displayName],legendSet[id,displayName],!lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,!userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,!externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,!user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,!dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,!organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit]')
              .map((res: Response) => res.json())
              .catch(error => Observable.throw(new Error(error)))
              .subscribe((favoriteResponse: any) => {
                /**
                 * Add map configurations to map data
                 * @type {MapConfiguration}
                 */
                mapData.details.mapConfiguration = this._getMapConfiguration(favoriteResponse);

                if (favoriteResponse.hasOwnProperty('mapViews')) {
                  let responseCount: number = 0;
                  let totalResponse: number = favoriteResponse.mapViews.length;
                  favoriteResponse.mapViews.forEach(view => {
                    let requestArray: any[] = [];

                    /**
                     * Get analytic observable for analytic type layers
                     */
                    if (view.layer != 'boundary' && view.layer != 'external' && view.layer != 'earthEngine' && view.layer != 'facility') {
                      requestArray.push(this.analyticsService.getAnalytics(view, mapData.type, customFilters))
                    }

                    /**
                     * Get geo feature parameters if any and create an observable for requesting it
                     */
                    let geoFeatureParams = this._getGeoFeatureParameters(view);

                    if (geoFeatureParams != null) {
                      requestArray.push(this._getGeoFeatures(geoFeatureParams));
                    }

                    /**
                     * Get predefined legends if any and create an observable for requesting it
                     * @type {"../../Observable".Observable<any>}
                     */
                    let predefinedLegendUrl = this._getPredefinedLegendUrl(view);

                    if (predefinedLegendUrl != null) {
                      requestArray.push(this._getPredefinedLegend(predefinedLegendUrl))
                    }


                    /**
                     * Make ajax call for available requests in the array
                     */
                    if (requestArray.length > 0) {
                      Observable.forkJoin(requestArray).subscribe((viewResult: any[]) => {
                        responseCount += 1;
                        let analyticsResult: any = {};

                        /**
                         * Check if only legend set is returned
                         */
                        if (viewResult.length == 1) {
                          /**
                           * Add geoFeatures on map data if any
                           */
                          view.geoFeatures = viewResult[0];
                        }

                        /**
                         * Check if analytics and geoFeatures are returned
                         */
                        if (viewResult.length === 2) {

                          /**
                           * Get analytics result if any
                           */
                          analyticsResult = viewResult[0];
                          /**
                           * Add geoFeatures on map data if any
                           */
                          view.geoFeatures = viewResult[1];
                        }

                        /**
                         * Check if analyitcs, geoFetaures and predifined legends are returned
                         */
                        if (viewResult.length === 3) {
                          /**
                           * Get analytics result if any
                           */
                          analyticsResult = viewResult[0];
                          /**
                           * Add geoFeatures on map data if any
                           */
                          view.geoFeatures = viewResult[1];
                          /**
                           * Add predefined legend on map data
                           */
                          view.legendSet = viewResult[2];
                        }


                        /**
                         * Update map data
                         */

                        mapData.layers.push({settings: view, analytics: analyticsResult});


                        /**
                         * Check if every request has completed
                         */
                        if (responseCount == totalResponse) {
                          /**
                           * Also save in visualization store
                           */
                          this.visualizationStore.createOrUpdate(mapData);

                          /**
                           * Return the sanitized data back to chart service
                           */
                          observer.next(mapData);
                          observer.complete();
                        }

                      }, viewError => {
                        observer.error(viewError);
                      });
                    } else {
                      /**
                       * Increment response count to compensate for view that dont require ajax call
                       */
                      if (view.layer == 'facility') {
                      }
                      responseCount++;
                      /**
                       * Update map data
                       */
                      mapData.layers.push({settings: view, analytics: {}});

                      if (responseCount == totalResponse) {
                        /**
                         * Also save in visualization store
                         */
                        this.visualizationStore.createOrUpdate(mapData);

                        /**
                         * Return the sanitized data back to chart service
                         */
                        observer.next(mapData);
                        observer.complete();
                      }
                    }
                  });

                } else {
                  observer.error({message: 'The object does not have map views in it'});
                }
              }, favoriteError => {
                observer.error(favoriteError)
              })
          } else {
            observer.error({message: 'Favorite essential parameters are not supplied'});
          }
        } else {
          observer.error({message: 'There is no favorite reference on this object'});
        }
      }
    })
  }

  public getColorScaleFromHigLow(colorHigh: String, colorLow: String, classes: number) {
    this._setColorBounds(colorHigh, colorLow);
    let parseLow = this._colorParse(colorLow, 'hex');
    let parseHigh = this._colorParse(colorHigh, 'hex');
    this.ends[0] = new Color(parseLow[0], parseLow[1], parseLow[2]);
    this.ends[1] = new Color(parseHigh[0], parseHigh[1], parseHigh[2]);
    this._stepCalc(classes);
    let colors = this._mixPalete(classes);

    let colorScale = "";

    colors.forEach((color, colorIndex) => {
      colorScale += color.bg
      if (colorIndex == color.length - 1) {
      } else {
        colorScale += ",";
      }

    })
    return colorScale;
  }

  public getColorScaleFromLegendSet(legendSet) {
    let legends = legendSet.legends;
    let sortedLegends = [];

    let legendsValue = [];
    let sortedLegendsValue = [];


    legends.forEach((legend, legendIndex) => {
      legendsValue.push(legend.startValue);
      sortedLegendsValue.push(legend.startValue);
    });

    sortedLegendsValue.sort((n1, n2) => n1 - n2);
    let colorScale = "";
    sortedLegendsValue.forEach((sortedLegendVale, legendValueIndex) => {
      let extraction = legends[legendsValue.indexOf(sortedLegendVale)];
      extraction = JSON.stringify(extraction);
      extraction = extraction.replace('startValue', 'min');
      extraction = extraction.replace('endValue', 'max');
      extraction = eval('(' + extraction + ')');
      sortedLegends.push(extraction);
      colorScale += extraction.color + ','
    })

    return {colorScale: colorScale, sets: sortedLegends}

  }

  public getMapFacilityLegend(features, settings) {
    let legend: LegendItem = {
      layerId: "",
      name: "",
      description: "",
      pinned: false,
      useIcons: false,
      opacity: 0,
      layer: "",
      classes: [],
      change: []
    }

    let groupSet = settings.groupSet;
    legend.layerId = settings.id;
    legend.name = groupSet.name;
    legend.opacity = groupSet.opacity;


    groupSet.organisationUnitGroups.forEach(group => {
      let classLegend: Class = {
        name: group.name,
        label: "",
        description: "",
        collapse: "",
        min: 0,
        max: 0,
        color: "",
        icon: group.symbol,
        radius: 0,
        count: 0
      }

      features.forEach(feature => {
        let propertyNames = Object.getOwnPropertyNames(feature.dimensions);
        propertyNames.forEach(dimensionId => {
          if (feature.dimensions[dimensionId] == group.name) {
            classLegend.count += 1;
          }
        });
      })

      legend.classes.push(classLegend);

    })


    return {
      htmlLegend: "", scriptLegend: legend,
      colorScale: [],
      getFeatureRadius: (featureValue) => {
        return null
      },
      getFeatureColor: (featureValue) => {

      }
    }

  }

  public getMapLegends(features, sortedData, settings) {

    let legendSettings = settings;

    let legendsFromLegendSet = null;

    let obtainedDataLegend = null;

    if (!legendSettings.colorScale && !legendSettings.legendSet) {
      legendSettings['colorScale'] = this.getColorScaleFromHigLow(legendSettings.colorHigh, legendSettings.colorLow, legendSettings.classes);
    }

    if (!legendSettings.colorScale && legendSettings.legendSet) {
      legendsFromLegendSet = this.getColorScaleFromLegendSet(legendSettings.legendSet);
      legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
    }


    if (legendSettings.colorScale && legendSettings.legendSet) {
      legendsFromLegendSet = this.getColorScaleFromLegendSet(legendSettings.legendSet);
      legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
    }


    if (legendSettings.method == 1) {
      obtainedDataLegend = this._legendSetLegend(sortedData, legendsFromLegendSet, settings);
    }

    if (legendSettings.method == 2) {
      if (settings.legendSet) {
        obtainedDataLegend = this._legendSetLegend(sortedData, legendsFromLegendSet, settings);
      } else {
        obtainedDataLegend = this._generateClassLimits(sortedData, legendSettings, "equalInterval");
      }

    }

    if (legendSettings.method == 3) {

      if (settings.legendSet) {
        obtainedDataLegend = this._legendSetLegend(sortedData, legendsFromLegendSet, settings);
      } else {
        obtainedDataLegend = this._generateClassLimits(sortedData, legendSettings, "equalCounts");
      }
    }

    let legend: LegendItem = this.getDataLegend(obtainedDataLegend, settings);
    return {
      htmlLegend: this._prepareHTMLLegendNew(legend, legendSettings), scriptLegend: legend,
      colorScale: legendSettings['colorScale'],
      getFeatureRadius: (featureValue) => {
        return this.getMapRadiusLegend(features, settings, sortedData, featureValue)
      },
      getFeatureColor: (featureValue) => {

      }
    }

  }

  public getDataLegend(obtainedDataLegend, settings): LegendItem {
    let legend =
      {
        layerId: settings.id,
        name: settings.name,
        description: settings.period,
        collapse: "",
        pinned: false,
        useIcons: true,
        opacity: settings.opacity,
        layer: settings.layer,
        classes: [],
        change: []
      }

    let legendClasses: Array<Class> = [];

    obtainedDataLegend.scriptLegend.forEach((legendItem, legendItemIndex) => {
      let legendClass: Class = {
        name: "",
        label: "",
        description: "",
        collapse: "",
        min: 0,
        max: 0,
        color: "",
        icon: "",
        radius: 0,
        count: 0
      };

      legendClass.name = legendItem.min + " - " + legendItem.max;
      legendClass.label = legendItem.name;
      legendClass.color = legendItem.color;
      legendClass.min = +(legendItem.min);
      legendClass.max = +(legendItem.max);
      legendClass.radius = legendItem.radius;
      legendClass.icon = legendItem.icon;
      legendClasses.push(legendClass);
    })

    legend.classes = legendClasses;

    return legend;
  }

  public getMapRadiusLegend(features, settings, dataArray, value) {

    let eventClustering = settings.eventClustering;
    let legendSet = settings.legendSet;
    let radiusHigh = settings.radiusHigh;
    let radiusLow = settings.radiusLow;
    let classess = settings.classes;
    let method = settings.method;
    let legendType = '';
    let legendObject: Legend = null;
    let legendsFromLegendSet = null;
    let colorScaleArray = [];
    let legend = [];

    let radius = 0;

    //
    let interval = +((radiusHigh - radiusLow) / classess).toFixed(1);
    let radiusArray = [];
    for (let classNumber = 0; classNumber < classess; classNumber++) {
      if (classNumber == 0) {
        radiusArray.push(radiusLow);
      } else {
        radiusArray.push(radiusArray[classNumber - 1] + interval);
      }

    }


    var classLimits = [], classRanges = [], doneWorkAround = false;

    //Workaround for classess more than values
    if (dataArray.length < classess) {
      if (dataArray.length == 0 && doneWorkAround == false) {
        dataArray.push(0);
        doneWorkAround = true;
      }
      if (dataArray.length == 1 && doneWorkAround == false) {
        dataArray.push(dataArray[0] + 1);
        doneWorkAround = true;
      }
    }

    for (let classIncr = 0; classIncr <= classess; classIncr++) {
      if (method == "equalCounts") {
        let index = classIncr / classess * (dataArray.length - 1);
        if (Math.floor(index) == index) {
          classLimits.push(dataArray[index]);
        } else {
          let approxIndex = Math.floor(index)
          classLimits.push(dataArray[approxIndex] + (dataArray[approxIndex + 1] - dataArray[approxIndex]) * (index - approxIndex));
        }
      } else {
        classLimits.push(Math.min.apply(Math, dataArray) + ( (Math.max.apply(Math, dataArray) - Math.min.apply(Math, dataArray)) / classess ) * classIncr);
      }
    }

    if (doneWorkAround) dataArray.pop();//Offset Workaround
    //Populate data count into classess
    classLimits.forEach(function (classLimit, classIndex) {
      if (classIndex < classLimits.length - 1) {
        var min = classLimits[classIndex], max = classLimits[classIndex + 1];
        legend.push({min: min.toFixed(1), max: max.toFixed(1), radius: radiusArray[classIndex]});
      }
    });


    let theRadius = 0;
    legend.forEach(function (classRadiusLimit, classRadiusIndex) {
      if (classRadiusLimit.min <= value && value < classRadiusLimit.max) {
        theRadius = classRadiusLimit.radius;
      }

      if (classRadiusIndex == legend.length - 1 && classRadiusLimit.min < value && value == classRadiusLimit.max) {
        theRadius = classRadiusLimit.radius;
      }

    });
    return theRadius;

  }

  public decideColor(dataElementScore: any, counter: any, legends: any, colorScale) {
    let colorScaleArray = Array.isArray(colorScale) ? colorScale : colorScale.split(',');
    let respectiveScoreColor: String = "rgba(255,255,255,0)";
    legends.forEach((legendItem: any, legendItemIndex) => {
      if (legendItem.min <= dataElementScore && dataElementScore < legendItem.max) {
        respectiveScoreColor = colorScaleArray[legendItemIndex];
        legendItem.color = respectiveScoreColor;
        legendItem.count += 1;
      }

      if (legendItemIndex == legends.length - 1 && legendItem.min < dataElementScore && dataElementScore == legendItem.max) {
        respectiveScoreColor = colorScaleArray[legendItemIndex];
        legendItem.color = respectiveScoreColor;
        legendItem.count += 1;
      }
    })
    return {respectiveScoreColor: respectiveScoreColor, updatedLegend: legends};
  }

  public sortDataArray(data) {
    let sortedData: Array<number> = [];

    data.forEach(dataValue => {
      if (dataValue.properties.dataElement.value !== "") {
        sortedData.push(dataValue.properties.dataElement.value);
      }
    })

    sortedData = sortedData.sort((n1, n2) => n1 - n2);


    return sortedData;
  }

  public dataDownLoad(formatType) {
  }

  private _legendSetLegend(dataArray, legendsFromLegendSet, settings) {
    let legend: Legend = {htmlLegend: {}, scriptLegend: []};


    if (legendsFromLegendSet != null) {

      let interval = +((settings.radiusHigh - settings.radiusLow) / legendsFromLegendSet.sets.length).toFixed(0);
      let radiusArray = [];
      for (let classNumber = 0; classNumber < legendsFromLegendSet.sets.length; classNumber++) {
        if (classNumber == 0) {
          radiusArray.push(settings.radiusLow);
        } else {
          radiusArray.push(radiusArray[classNumber - 1] + interval);
        }
      }

      legendsFromLegendSet.sets.forEach((set, setIndex) => {
        legend.scriptLegend.push({
          min: set.min,
          max: set.max,
          count: 0,
          color: set.color,
          name: set.name,
          radius: radiusArray[setIndex]
        });
      })
    } else {

    }
    legend = this._getLegendCounts(dataArray, legend);
    legend.htmlLegend = this._prepareHTMLLegend(legendsFromLegendSet, legend, settings);
    return legend;
  }


  // _generateClassLimits({dataArray:[],classes,method,colors:[],icons:[],labels:[]})
  private _generateClassLimits(dataArray: Array<any>, settings, method = "equalInterval") {

    let legend: Legend = {htmlLegend: {}, scriptLegend: []};
    var classLimits = [], classRanges = [], doneWorkAround = false;


    let interval = +((settings.radiusHigh - settings.radiusLow) / settings.classes).toFixed(0);
    let radiusArray = [];
    for (let classNumber = 0; classNumber < settings.classes; classNumber++) {
      if (classNumber == 0) {
        radiusArray.push(settings.radiusLow);
      } else {
        radiusArray.push(radiusArray[classNumber - 1] + interval);
      }
    }


    //Workaround for classess more than values
    if (dataArray.length < settings.classes) {
      if (dataArray.length == 0 && doneWorkAround == false) {
        dataArray.push(0);
        doneWorkAround = true;
      }
      if (dataArray.length == 1 && doneWorkAround == false) {
        dataArray.push(dataArray[0] + 1);
        doneWorkAround = true;
      }
    }

    for (let classIncr = 0; classIncr <= settings.classes; classIncr++) {
      if (method == "equalCounts") {
        let index = classIncr / settings.classes * (dataArray.length - 1);
        if (Math.floor(index) == index) {
          classLimits.push(dataArray[index]);
        } else {
          let approxIndex = Math.floor(index)
          classLimits.push(dataArray[approxIndex] + (dataArray[approxIndex + 1] - dataArray[approxIndex]) * (index - approxIndex));
        }
      } else {
        classLimits.push(Math.min.apply(Math, dataArray) + ( (Math.max.apply(Math, dataArray) - Math.min.apply(Math, dataArray)) / settings.classes ) * classIncr);
      }
    }

    if (doneWorkAround) dataArray.pop();//Offset Workaround
    //Populate data count into classes
    classLimits.forEach(function (classLimit, classIndex) {
      if (classIndex < classLimits.length - 1) {
        let min = classLimits[classIndex], max = classLimits[classIndex + 1];
        legend.scriptLegend.push({
          min: min.toFixed(1),
          max: max.toFixed(1),
          color: "",
          count: 0,
          radius: radiusArray[classIndex]
        });
      }
    });
    legend = this._getLegendCounts(dataArray, legend);
    return legend
  }


  private _getLegendCounts(dataArray, legend) {
    dataArray.forEach(data => {
      legend.scriptLegend.forEach((legendItem, legendIndex) => {
        if (legendItem.min <= data && data < legendItem.max) {
          legendItem.count += 1;
        }

        if (legendIndex == legend.scriptLegend.length - 1 && legendItem.min < data && data == legendItem.max) {
          legendItem.count += 1;
        }
      })
    })
    return legend;
  }


  private _prepareHTMLLegendNew(legend, legendSettings) {
    let html = "<p style='margin:0 0 0px!important;'>&nbsp;&nbsp;<b>" + legend.name + "</b></p>";
    html += "<span>&nbsp;&nbsp;" + legend.description + "</span>";
    html += "<table>";
    legendSettings.colorScale = Array.isArray(legendSettings.colorScale) ? legendSettings.colorScale : legendSettings.colorScale.split(',');
    legend.classes.forEach((legendClass, legendClassIndex) => {
      legendClass.color = legendClass.color == "" ? legendSettings.colorScale[legendClassIndex] : legendClass.color;
      html += "<tr style='border: 4px solid #ffffff;'>";
      html += "<td style='background-color:" + legendClass.color + ";color:" + legendClass.color + ";width:25px;height:10px;'>&nbsp;</td>";
      html += "<td style='text-align: left;'>";
      if (legendClass.label) {
        html += "&nbsp;<span style='font-weight: bold;'>&nbsp;" + legendClass.label + "</span><br/>";
      }
      html += "&nbsp;" + legendClass.min + " - " + legendClass.max + "(" + legendClass.count + ")";
      html += "</tr>";
    });
    html += "</table>";
    legend.htmlLegend = html;
    return legend.htmlLegend;

  }

  private _prepareHTMLLegend(legendsFromLegendSet, legend, legendSetting) {
    let html = "<br/><p style='margin:0 0 0px!important;'>&nbsp;&nbsp;<b>" + legendSetting.name + "</b></p>";
    html += "<span>&nbsp;&nbsp;" + legendSetting.period + "</span>";
    html += "<table>";
    if (legendsFromLegendSet) {
      legend.scriptLegend.forEach((legendString, legendStringIndex) => {
        html += "<tr style='border: 4px solid #ffffff;'>";
        html += "<td style='background-color:" + legendString.color + ";color:" + legendString.color + ";width:25px;height:20px;'>&nbsp;</td>";

        html += "<td>";
        if (legendString.name) {
          html += "&nbsp;<span style='font-weight: bold;'>&nbsp;" + legendString.name + "</span><br/>";
        }
        html += "&nbsp;" + legendString.min + " - " + legendString.max + "(" + legendString.count + ")";
        html += "</td>";
        html += "</tr>";

      });
    }

    else if (legend) {
      let colorScale = Array.isArray(legendSetting.colorScale) ? legendSetting.colorScale : legendSetting.colorScale.split(',');
      legend.scriptLegend.forEach((legendString, legendStringIndex) => {
        if (colorScale) {
          let color = colorScale[legendStringIndex];
          html += "<tr style='border: 4px solid #ffffff;'>";
          html += "<td style='background-color:" + color + ";color:" + color + ";width:25px;height:10px;'>&nbsp;</td>";
          if (legendString.name) {
            html += "<td style='font-weight: bold;'>&nbsp;" + legendString.name + "</td>";
          }
          html += "<td>&nbsp;" + legendString.min + " - " + legendString.max + "(" + legendString.count + ")</td>";
          html += "</tr>";
        }

      });
    }

    html += "</table>";
    legend.htmlLegend = html;
    return legend.htmlLegend;
  }


  private _prepareDataRange(data) {
    let sortedData = this.sortDataArray(data);

    return {
      min: sortedData[0],
      max: sortedData[sortedData.length - 1] ? sortedData[sortedData.length - 1] : sortedData[0],
      size: sortedData.length
    };
  }

  private _mixPalete(steps: number) {
    let count = steps + 2;
    let palette: Array<any> = [];

    palette[0] = new Color(this.ends[0].red, this.ends[0].green, this.ends[0].blue);
    palette[count] = new Color(this.ends[1].red, this.ends[1].green, this.ends[1].blue);
    for (let i = 1; i < count; i++) {
      let red = (this.ends[0].red + (this.step[0] * i));
      let green = (this.ends[0].green + (this.step[1] * i));
      let blue = (this.ends[0].blue + (this.step[2] * i));
      palette[i] = new Color(red, green, blue);
    }
    return palette;
  }

  private _colorParse(color, colorType) {
    let m = 1;
    let base = 16;
    let num: Array<any> = [];
    color = color.toUpperCase();
    let colorRaw = color.replace('RGB', '').replace(/[\#\(]*/i, '');
    if (colorType == 'hex') {
      if (colorRaw.length == 3) {
        let colorSectionA = colorRaw.substr(0, 1);
        let colorSectionB = colorRaw.substr(1, 1);
        let colorSectionC = colorRaw.substr(2, 1);
        colorRaw = colorSectionA + colorSectionA + colorSectionB + colorSectionB + colorSectionC + colorSectionC;
      }
      num = new Array(colorRaw.substr(0, 2), colorRaw.substr(2, 2), colorRaw.substr(4, 2));
      base = 16;
    } else {
      num = colorRaw.split(',');
      base = 10;
    }

    if (colorType == 'rgbp') {
      m = 2.55
    }
    let ret = new Array(parseInt(num[0], base) * m, parseInt(num[1], base) * m, parseInt(num[2], base) * m);
    return (ret);
  }

  private _stepCalc(steps) {
    this.step[0] = (this.ends[1].red - this.ends[0].red ) / steps;
    this.step[1] = (this.ends[1].green - this.ends[0].green ) / steps;
    this.step[2] = (this.ends[1].blue - this.ends[0].blue) / steps;
  }

  private _setColorBounds(colorHigh: String, colorLow: String) {
    this.colorHigh = colorHigh;
    this.colorLow = colorLow;
  }

  private _getGeoFeatures(geoFeature): Observable<any> {
    return this.http.get(this._getGeoFeatureUrl(geoFeature))
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  private _getPredefinedLegend(url): Observable<any> {
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  public getOrganisationUnitGroupSet(url): Observable<any> {
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  private _getGeoFeatureUrl(geoFeatureParams: string) {
    let url: string = this.constant.api + 'geoFeatures.json?';
    url += geoFeatureParams;
    url += "&displayProperty=NAME&includeGroupSets=true";
    return url;
  }

  private _getPredefinedLegendUrl(mapView): string {
    let url: string = null;
    if (mapView.legendSet) {

      let legendId: String = mapView.legendSet.id;
      url = this.constant.api + 'legendSets/' + legendId + '.json?fields=id,name,legends[id,name,startValue,endValue,color]';

    }

    return url;
  }

  private _getOrganisationUnitGroupSetUrl(mapView): string {
    let url: string = null;
    if (mapView.organisationUnitGroupSet) {
      let organisationUnitGroupSet: String = mapView.organisationUnitGroupSet.id;
      url = this.constant.api + 'organisationUnitGroupSets/' + organisationUnitGroupSet + '.json?fields=organisationUnitGroups[id,symbol,name,displayName]';

    }

    return url;
  }

  private _getGeoFeatureParameters(mapView): string {
    let dimensionItems: any;
    let params: string = 'ou=ou:';
    let columnItems = this._findDimensionItems(mapView.columns, 'ou');
    let rowItems = this._findDimensionItems(mapView.rows, 'ou');
    let filterItems = this._findDimensionItems(mapView.filters, 'ou');
    if (columnItems != null) {
      dimensionItems = columnItems;
    } else if (rowItems != null) {
      dimensionItems = rowItems;
    } else if (filterItems != null) {
      dimensionItems = filterItems;
    }

    if (dimensionItems.length > 0) {
      dimensionItems.forEach(item => {
        params += item.dimensionItem + ";";

      })
    }

    return params != 'ou=ou:' ? params : null;
  }

  private _findDimensionItems(dimensionHolder, dimension): any {
    let items: any = null;
    if (dimensionHolder.length > 0) {
      for (let holder of dimensionHolder) {
        if (holder.dimension == dimension) {
          items = holder.items;
          break;
        }
      }
    }
    return items;
  }

  public _getMapConfiguration(favoriteObject): MapConfiguration {
    return {
      id: favoriteObject.hasOwnProperty('id') ? favoriteObject.id : null,
      name: favoriteObject.hasOwnProperty('name') ? favoriteObject.name : null,
      basemap: favoriteObject.hasOwnProperty('basemap') ? favoriteObject.basemap : null,
      zoom: favoriteObject.hasOwnProperty('zoom') ? favoriteObject.zoom : 0,
      latitude: favoriteObject.hasOwnProperty('latitude') ? favoriteObject.latitude : 0,
      longitude: favoriteObject.hasOwnProperty('longitude') ? favoriteObject.longitude : 0
    }
  }

  private _convertToMapType(favoriteObject): Observable<any> {
    let mapLayers: any[] = [];
    return Observable.create(observer => {
      let orgUnitArray = this._getDimensionArray(favoriteObject, 'ou');
      let periodArray = this._getDimensionArray(favoriteObject, 'pe');
      let dataArray = this._getDimensionArray(favoriteObject, 'dx');

      if (dataArray.hasOwnProperty('items') && dataArray.items.length > 0) {
        dataArray.items.forEach(dataItem => {
          if (periodArray.hasOwnProperty('items') && dataArray.items.length > 0) {
            periodArray.items.forEach(periodItem => {
              let mapLayer: any = {};

              /**
               * Create data part of the new layer
               * @type {{dimension: string; items: T}}
               */
              mapLayer[dataArray.dimension] = [{
                dimension: 'dx',
                items: [dataItem]
              }];

              /**
               * Create period part of the new layer
               * @type {{dimension: string; items: T}}
               */
              mapLayer[periodArray.dimension] = [{
                dimension: 'pe',
                items: [periodItem]
              }];

              /**
               * Create orgunit part of the new layer
               * @type {{dimension: string; items: (T|any|Array|SortableItem[]|Array<any>|Highcharts.LabelItem[])}}
               */
              if (orgUnitArray.hasOwnProperty('items')) {
                mapLayer[orgUnitArray.dimension] = [{
                  dimension: 'ou',
                  items: orgUnitArray.items
                }];
              }

              mapLayers.push(mapLayer);
            })
          }
        })
      } else {
        console.warn('An error has occurred, something wrong with the favorite');
      }
      observer.next(mapLayers);
      observer.complete();
    })
  }

  private _getDimensionArray(favoriteObject, dimension) {
    let dimensionArray: any = {};
    let found: boolean = false;
    //find in the column list first
    let columnItems = this._findDimensionItems(favoriteObject.hasOwnProperty('columns') ? favoriteObject.columns : [], dimension);
    if (columnItems != null) {
      dimensionArray = {
        dimension: 'columns',
        items: columnItems
      };
      found = true;
    }

    //find in the row list if not found
    if (!found) {
      let rowItems = this._findDimensionItems(favoriteObject.hasOwnProperty('rows') ? favoriteObject.rows : [], dimension);
      if (rowItems != null) {
        dimensionArray = {
          dimension: 'rows',
          items: rowItems
        };
        found = true;
      }
    }

    //find in the filter list if still not found
    if (!found) {
      let filterItems = this._findDimensionItems(favoriteObject.hasOwnProperty('filters') ? favoriteObject.filters : [], dimension);
      if (filterItems != null) {
        dimensionArray = {
          dimension: 'filters',
          items: filterItems
        };
        found = true;
      }
    }

    return dimensionArray;

  }


}

