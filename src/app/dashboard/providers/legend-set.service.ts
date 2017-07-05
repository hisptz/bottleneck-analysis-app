import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClientService} from '../../providers/http-client.service';
import * as _ from 'lodash';
import {OrgUnitService} from '../components/org-unit-filter/org-unit.service';
import {ColorInterpolationService} from './color-interpolation.service';
import {MapLayerEvent} from '../model/layer-event';

@Injectable()
export class LegendSetService {

  constructor(
    private http: HttpClientService,
    private orgUnitService: OrgUnitService,
    private colorInterpolation: ColorInterpolationService
  ) { }

  getLegendSet(visualizationDetails: any) {
    const apiRootUrl = visualizationDetails.apiRootUrl;
    const visualizationLayers = visualizationDetails.visualizationObject.layers;
    const legendSetArray = visualizationLayers.map(layer => {return layer.settings.legendSet});
    return Observable.create(observer => {
      Observable.forkJoin(
        legendSetArray.map(legendSet => {
          return legendSet ? this.http.get(this._getLegendSetUrl(apiRootUrl, legendSet.id)) : Observable.of(null)
        })
      ).subscribe(legendSets => {
        visualizationDetails.legendSets = legendSets;
        observer.next(visualizationDetails);
        observer.complete();
        }, error => observer.error(error));
    })
  }

  private _getLegendSetUrl(apiRootUrl, legendSetId) {
    return apiRootUrl + 'legendSets/' + legendSetId + '.json?fields=id,name,legends[id,name,startValue,endValue,color]';
  }

  public prepareTileLayers(tileLayers) {
    let baseMapLayers: any = [];

    let layerNames = Object.getOwnPropertyNames(tileLayers);

    layerNames.forEach(layer => {
      let tileLayer: any = {
        name: tileLayers[layer].name,
        label: tileLayers[layer].label,
        active: tileLayers[layer].active,
        aliasName: tileLayers[layer].aliasName,
        url: tileLayers[layer].url,
        image: tileLayers[layer].image,
        maxZoom: tileLayers[layer].maxZoom
      }
      baseMapLayers.push(tileLayer);
    })

    return baseMapLayers;
  }

  public prepareEventLayerLegendClasses(visualizationLayerSettings, visualizationAnalytics) {
    let legend: any[] = [];
    const eventPointColor = this._strimMoreHashFromColor(visualizationLayerSettings.eventPointColor);
    const eventPointRadius = visualizationLayerSettings.eventPointRadius;


    legend.push({
      name: this.getEventName(visualizationAnalytics)[1],
      label: this.getEventName(visualizationAnalytics)[1],
      description: "",
      relativeFrequency: "",
      min: 0,
      max: 0,
      color: eventPointColor,
      count: visualizationAnalytics.height,
      radius: eventPointRadius,
      boundary: false
    });
    return legend;
  }

  public boundaryLayerLegendClasses(mapVisualizationSettings, mapVisualizationAnalytics?): Observable<any> {
    const features = mapVisualizationSettings.geoFeature;
    let Levels = this._getBoundaryLevels(features);
    let totalFeatures = features.length;
    let boundaryLevels = [];
    let legend: any[] = [];


    return Observable.create((observable) => {
      this.orgUnitService.getOrgunitLevelsInformation().subscribe((organisationUnitLevelsData: any) => {
        organisationUnitLevelsData.organisationUnitLevels.forEach((organisationUnitLevel) => {
          let indexLevel = _.findIndex(Levels, ['id', organisationUnitLevel.level]);
          if (_.find(Levels, ['id', organisationUnitLevel.level])) {
            Levels[indexLevel].name = organisationUnitLevel.name;
          }
        })

        Levels.forEach(level => {
          legend.push({
            name: level.name,
            label: level.name,
            description: "",
            relativeFrequency: "",
            min: 0,
            max: 0,
            percentage: ((level.count / totalFeatures) * 100).toFixed(0) + "%",
            color: this._getLevelColor(Levels, level),
            count: level.count,
            radius: "",
            boundary: true
          });
        })
        observable.next(legend);
        observable.complete();
      })
    })
  }

  public boundaryLayerClasses(mapVisualizationSettings) {
    const features = mapVisualizationSettings.geoFeature;
    let Levels = this._getBoundaryLevels(features);
    let legend: any[] = [];

    Levels.forEach(level => {
      legend.push({
        name: level.id,
        label: level.id,
        description: "",
        relativeFrequency: "",
        min: 0,
        max: 0,
        color: this._getLevelColor(Levels, level),
        count: level.count,
        radius: "",
        boundary: true
      });
    });
    return legend;

  }

  public prepareThematicLayerLegendClasses(visualizationLayerSettings, visualizationAnalytics) {
    let legendSettings = visualizationLayerSettings;
    let dataArray = [];

    let legendsFromLegendSet = null;

    let obtainedDataLegend = null;

    if (!legendSettings.colorScale && !legendSettings.legendSet) {
      legendSettings['colorScale'] = this.colorInterpolation.getColorScaleFromHigLow(visualizationLayerSettings);
    }

    if (!legendSettings.colorScale && legendSettings.legendSet) {
      legendsFromLegendSet = this.getColorScaleFromLegendSet(legendSettings.legendSet);
      legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
    }


    if (legendSettings.colorScale && legendSettings.legendSet) {
      legendsFromLegendSet = this.getColorScaleFromLegendSet(legendSettings.legendSet);
      legendSettings['colorScale'] = legendsFromLegendSet.colorScale;
    }

    if (visualizationAnalytics.hasOwnProperty('headers')) {
      visualizationAnalytics.rows.forEach((row) => {
        dataArray.push(+row[_.findIndex(visualizationAnalytics.headers, {'name': 'value'})]);
      })
      const sortedData = _(dataArray).sortBy().value();

      if (legendSettings.method == 1) {
        obtainedDataLegend = this.prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics);
      }

      if (legendSettings.method == 2) {
        if (legendSettings.legendSet) {
          obtainedDataLegend = this.prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics);
        } else {
          obtainedDataLegend = this.generateLegendClassLimits(visualizationLayerSettings, visualizationAnalytics);
        }

      }

      if (legendSettings.method == 3) {

        if (legendSettings.legendSet) {
          obtainedDataLegend = this.prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics);
        } else {
          obtainedDataLegend = this.generateLegendClassLimits(visualizationLayerSettings, visualizationAnalytics);
        }
      }

    }
    return obtainedDataLegend;
  }

  public getEventName(visualizationAnalytics) {
    let metaDataObject = visualizationAnalytics.metaData;

    // TODO : Find a best way to remove this hardcoding
    let eventId: string = "";
    for (let propt in metaDataObject) {
      if (['names', 'pe', 'ou'].indexOf(propt) == -1) {
        eventId = propt;
      }

    }

    return [metaDataObject.names[eventId], metaDataObject[eventId]];
  }

  public prepareLayerEvent(layer, action): MapLayerEvent {
    let event: MapLayerEvent = {
      action: action,
      layer: layer
    }

    return event;
  }

  private _getLevelColor(Levels, level) {
    let colorByIndex = ["#000000", "#0101DF", "#2F2FFD", "#FF0000", "#008000"];
    if (Levels.length == 1) {
      return "#000000";
    } else {
      return colorByIndex[Levels.indexOf(level)];
    }
  }

  generateLegendClassLimits(visualizationLayerSettings, visualizationAnalytics) {
    let legendSetColorArray: any = null;
    if (visualizationLayerSettings.colorScale) {
      legendSetColorArray = Array.isArray(visualizationLayerSettings.colorScale) ? visualizationLayerSettings.colorScale : visualizationLayerSettings.colorScale.split(",");
    } else {
      legendSetColorArray = this.colorInterpolation.getColorScaleFromHigLow(visualizationLayerSettings);
    }


    let dataArray: any[] = [], legend: any = [];
    let classLimits = [], classRanges = [], doneWorkAround = false;

    if (visualizationAnalytics.hasOwnProperty('headers')) {
      let sortedData = this._getDataSortedArray(visualizationAnalytics);
      dataArray = sortedData;

      let interval = +((visualizationLayerSettings.radiusHigh - visualizationLayerSettings.radiusLow) / visualizationLayerSettings.classes).toFixed(0);
      let radiusArray = [];
      for (let classNumber = 0; classNumber < visualizationLayerSettings.classes; classNumber++) {
        if (classNumber == 0) {
          radiusArray.push(visualizationLayerSettings.radiusLow);
        } else {
          radiusArray.push(radiusArray[classNumber - 1] + interval);
        }
      }

      //Workaround for classess more than values
      if (sortedData.length < visualizationLayerSettings.classes) {
        if (sortedData.length == 0 && doneWorkAround == false) {
          sortedData.push(0);
          doneWorkAround = true;
        }
        if (sortedData.length == 1 && doneWorkAround == false) {
          sortedData.push(sortedData[0] + 1);
          doneWorkAround = true;
        }
      }

      for (let classIncr = 0; classIncr <= visualizationLayerSettings.classes; classIncr++) {
        if (visualizationLayerSettings.method == 3) { // equal counts
          let index = classIncr / visualizationLayerSettings.classes * (sortedData.length - 1);
          if (Math.floor(index) == index) {
            classLimits.push(sortedData[index]);
          } else {
            let approxIndex = Math.floor(index)
            classLimits.push(sortedData[approxIndex] + (sortedData[approxIndex + 1] - sortedData[approxIndex]) * (index - approxIndex));
          }
        } else {
          classLimits.push(Math.min.apply(Math, sortedData) + ( (Math.max.apply(Math, sortedData) - Math.min.apply(Math, sortedData)) / visualizationLayerSettings.classes ) * classIncr);
        }
      }


      if (doneWorkAround) dataArray.pop();
      //Offset Workaround
      //Populate data count into classes
      classLimits.forEach(function (classLimit, classIndex) {
        if (classIndex < classLimits.length - 1) {
          let min = classLimits[classIndex], max = classLimits[classIndex + 1];
          legend.push({
            name: "",
            label: "",
            description: "",
            relativeFrequency: "",
            min: +min.toFixed(1),
            max: +max.toFixed(1),
            color: legendSetColorArray[classIndex],
            count: 0,
            radius: 0,
            boundary: false
          });
        }
      });

    }
    legend = this.getLegendCounts(dataArray, legend);
    return legend;
  }

  getMapRadiusLegend(settings, analytics) {
    let radiusHigh = settings.radiusHigh;
    let radiusLow = settings.radiusLow;
    let classess = settings.classes;
    let method = settings.method;
    let legend = [];
    let dataArray = this._getDataSortedArray(analytics);

    let interval = +((radiusHigh - radiusLow) / classess).toFixed(0);
    let radiusArray = [];
    for (let classNumber = 0; classNumber < classess; classNumber++) {
      if (classNumber == 0) {
        radiusArray.push(radiusLow);
      } else if (classNumber == classess - 1) {
        radiusArray.push(radiusHigh);
      } else {
        radiusArray.push(radiusArray[classNumber - 1] + interval);
      }

    }

    var classLimits = [], doneWorkAround = false;

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
      if (method == 3) {
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
        legend.push({min: +(min.toFixed(1)), max: +(max.toFixed(1)), radius: radiusArray[classIndex]});
      }
    });

    return legend;

  }

  getFeatureRadius(legend, dataValue) {
    let theRadius = 0;
    let value = +(dataValue);
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

  prepareLegendSet(visualizationLayerSettings, legendsFromLegendSet, visualizationAnalytics) {
    let legend: any[] = [];
    let dataArray: any[] = [];
    let interval = +((visualizationLayerSettings.radiusHigh - visualizationLayerSettings.radiusLow) / legendsFromLegendSet.sets.length).toFixed(0);
    let radiusArray = [];
    for (let classNumber = 0; classNumber < legendsFromLegendSet.sets.length; classNumber++) {
      if (classNumber == 0) {
        radiusArray.push(visualizationLayerSettings.radiusLow);
      } else {
        radiusArray.push(radiusArray[classNumber - 1] + interval);
      }
    }

    dataArray = this._getDataSortedArray(visualizationAnalytics);
    legendsFromLegendSet.sets.forEach((set, setIndex) => {
      legend.push({
        name: set.name,
        label: set.name,
        description: "",
        percentage: 0,
        min: set.min,
        max: set.max,
        count: 0,
        color: set.color,
        radius: radiusArray[setIndex],
        boundary: false
      });
    });
    legend = this.getLegendCounts(dataArray, legend);
    return legend;
  }

  getColorScaleFromLegendSet(legendSet) {
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

  getLegendCounts(dataArray, legend) {
    let totalCounts = 0;
    dataArray.forEach(data => {
      legend.forEach((legendItem, legendIndex) => {
        if (legendItem.min <= data && data < legendItem.max) {
          legendItem.count += 1;
          totalCounts += 1;
        }

        if (legendIndex == legend.length - 1 && legendItem.min < data && data == legendItem.max) {
          legendItem.count += 1;
          totalCounts += 1;
        }
      });
    });

    legend.forEach(leg => {
      let fraction = (leg.count / totalCounts);
      leg.percentage = fraction ? (fraction * 100).toFixed(0) + "%" : "";
    })

    return legend;
  }

  getFacilityLayerLegendClasses(visualizationLayerSettings) {
    let legend = {
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

    let groupSet = visualizationLayerSettings.groupSet;
    let features = visualizationLayerSettings.geoFeature;
    legend.layerId = visualizationLayerSettings.id;
    legend.name = groupSet.name;
    legend.opacity = visualizationLayerSettings.opacity ? visualizationLayerSettings.opacity * 100 : 80;

    let totalFeatures: number = features.length;

    groupSet.organisationUnitGroups.forEach(group => {

      let classLegend = {
        name: group.name,
        label: "",
        id: group.id,
        description: "",
        relativeFrequency: "",
        min: 0,
        max: 0,
        level: 0,
        color: "",
        collapse: "",
        icon: group.symbol,
        radius: 0,
        count: 0,
        boundary: false
      }

      features.forEach(feature => {
        let propertyNames = Object.getOwnPropertyNames(feature.dimensions);
        propertyNames.forEach(dimensionId => {
          if (feature.dimensions[dimensionId] == group.id) {
            classLegend.count += 1;
          }
        });
      })

      classLegend.relativeFrequency = totalFeatures != 0 ? (classLegend.count / totalFeatures).toFixed(0) + "%" : "";
      legend.classes.push(classLegend);

    })

    return legend.classes;
  }

  private _strimMoreHashFromColor(color) {
    let colorArray = color.split("#");
    return "#" + colorArray[colorArray.length - 1];
  }

  private _getBoundaryLevels(features) {
    let levels: any[] = [];
    features.forEach(feature => {
      if (_.find(levels, ['id', feature.le])) {

        _.find(levels, ['id', feature.le]).count += 1;
      }
      else {
        levels.push({id: feature.le, name: null, count: 1})
      }
    })
    return levels;
  }

  private _getDataSortedArray(visualizationAnalytics) {
    let dataArray = [];
    let sortedData = [];
    if (visualizationAnalytics.hasOwnProperty('headers')) {
      visualizationAnalytics.rows.forEach((row) => {
        dataArray.push(+row[_.findIndex(visualizationAnalytics.headers, {'name': 'value'})]);
      })
      sortedData = _(dataArray).sortBy().value();
    }
    return sortedData;
  }
}
