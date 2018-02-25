import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class MapFilesService {

  constructor() {
  }

  downloadMapVisualizationAsCSV(mapVisualization) {
    const payload = mapVisualization.payload && mapVisualization.payload !== '' ? mapVisualization.payload : {};
    const legends = payload.mapLegends;
    const visualization = payload.visualization;

    const layers = visualization.layers;
    const analytics = visualization.analytics;
    const geofeatures = visualization.geofeatures;

    layers.forEach(layer => {
      const legend = _.find(legends, ['layer', layer.id]).legend;
      const data = this._prepareCSVDataForDownload(analytics[layer.id], layer, legend, geofeatures[layer.id]);

      const hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
      hiddenElement.target = '_blank';
      hiddenElement.download = data.name + '.csv';
      hiddenElement.click();
    })


    return null;
  }

  downloadMapVisualizationAsKML(mapVisualization) {
    return null;
  }

  downloadMapVisualizationAsGML(mapVisualization) {
    return null;
  }

  downloadMapVisualizationAsSHAPEFILE(mapVisualization) {
    return null;
  }


  downloadMapVisualizationAsGeoJSON(mapVisualization) {
    return null;
  }


  private _prepareCSVDataForDownload(data, settings, legend, geoFeatures) {

    if (data === null) {
      return null;
    }

    let result, ctr, keys, columnDelimiter, lineDelimiter;
    const uids = [];
    if (data.hasOwnProperty('headers')) {

      const orgIndex = _.findIndex(data.headers, ['name', 'ou']);
      const valueIndex = _.findIndex(data.headers, ['name', 'value']);

      columnDelimiter = ',';
      lineDelimiter = '\n';
      keys = ['CODE', 'ID', 'LEVEL', 'NAME', 'PARENT', 'PARENT ID'];
      data.metaData.dx.forEach((dataElement, dataElementIndex) => {

        keys.push(data.metaData.names[dataElement]);
        uids.push(dataElement);
        if (dataElementIndex === data.metaData.dx.length - 1) {
          keys.push('RANGE');
          keys.push('FREQUENCY');
          keys.push('COLOR');
          keys.push('COORDINATE');
        }

      });
      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.rows.forEach((item) => {
        const orgUnitCoordinateObject = this._getOrgUnitCoordinateObject(data.headers, item, geoFeatures);
        ctr = 0;
        result += orgUnitCoordinateObject.code;
        result += columnDelimiter;

        result += orgUnitCoordinateObject.id;
        result += columnDelimiter;


        result += orgUnitCoordinateObject.le;
        result += columnDelimiter;

        result += data.metaData.names[item[orgIndex]];
        result += columnDelimiter;
        result += orgUnitCoordinateObject.pn;
        result += columnDelimiter;
        result += orgUnitCoordinateObject.pi;
        result += columnDelimiter;
        uids.forEach((key, keyIndex) => {
          result += item[valueIndex];
          ctr++;
        });
        result += columnDelimiter;
        const classBelonged: any = this._getClass(data.headers, item, legend);
        result += classBelonged ? classBelonged.startValue + ' - ' + classBelonged.endValue : '';
        result += columnDelimiter;
        result += classBelonged ? classBelonged.count : '';
        result += columnDelimiter;
        result += classBelonged ? classBelonged.color : '';
        result += columnDelimiter;
        result += this._refineCoordinate(orgUnitCoordinateObject.co);
        result += lineDelimiter;
      });
    } else {
      return '';
    }


    return result;
  }

  private _refineCoordinate(coordinate) {
    return '\"' + coordinate + '\"';
  }

  private _getClass(headers, item, legend) {
    let indexOfValue = 0;
    headers.forEach((header, headerIndex) => {
      if (header.name === 'value') {
        indexOfValue = headerIndex;
      }

    });

    const data = item[indexOfValue];
    let classInterval = {};
    legend.items.forEach((legendItem, itemIndex) => {
      if (legendItem.startValue <= data && legendItem.endValue >= data) {
        classInterval = legendItem;
      }
    })
    return classInterval;
  }

  private _getOrgUnitCoordinateObject(headers, item, geoFeatures) {
    let indexOfOu = 0;
    headers.forEach((header, headerIndex) => {
      if (header.name === 'ou') {
        indexOfOu = headerIndex;
      }
    });

    const OrgUnit = item[indexOfOu];
    return _.find(geoFeatures, ['id', OrgUnit]);
  }
}
