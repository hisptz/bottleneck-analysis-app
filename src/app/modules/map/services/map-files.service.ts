import {Injectable} from '@angular/core';
import * as _ from 'lodash';
@Injectable()
export class MapFilesService {

  constructor() {
  }

  downloadMapVisualizationAsCSV(mapVisualization) {
    console.log(mapVisualization);
  }

  private _prepareCSVDataForDownload(data, settings, geoFeatures) {

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
      keys = ['Organisation Unit'];
      data.metaData.dx.forEach((dataElement, dataElementIndex) => {

        keys.push(data.metaData.names[dataElement]);
        uids.push(dataElement);
        if (dataElementIndex === data.metaData.dx.length - 1) {
          keys.push('Class Interval');
          keys.push('Frequency');
          keys.push('Color');
          keys.push('Coordinate');
        }

      });
      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.rows.forEach((item) => {
        ctr = 0;
        uids.forEach((key, keyIndex) => {
          result += data.metaData.names[item[orgIndex]];
          result += columnDelimiter;
          result += item[valueIndex];
          ctr++;
        });

        const classBelonged: any = {};

        result += columnDelimiter;
        result += classBelonged ? classBelonged.min + ' - ' + classBelonged.max : '';
        result += columnDelimiter;
        result += classBelonged ? classBelonged.count : '';
        result += columnDelimiter;
        result += classBelonged ? classBelonged.color : '';
        result += columnDelimiter;
        result += 'Sample Coordinate';
        result += lineDelimiter;
      });
    } else {
      return '';
    }


    return result;
  }

}
