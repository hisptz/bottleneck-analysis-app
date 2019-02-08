import * as _ from 'lodash';
import { getAllowedChartType } from './get-allowed-chart-types.helper';

export function getChartSeriesWithAxisOptions(
  series: any[],
  multiAxisOptions: any[]
) {
  return _.map(series, (seriesObject: any) => {
    const newSeriesObject = _.clone(seriesObject);
    const availableAxisOption: any = _.find(multiAxisOptions, [
      'id',
      newSeriesObject.id
    ]);
    if (availableAxisOption) {
      newSeriesObject.yAxis = availableAxisOption.axis === 'left' ? 0 : 1;
      newSeriesObject.type =
        availableAxisOption.type !== ''
          ? getAllowedChartType(availableAxisOption.type)
          : seriesObject.type;

      if (availableAxisOption.type === 'dotted') {
        newSeriesObject.lineWidth = 0;
        newSeriesObject.states = {
          hover: {
            enabled: false
          }
        };
      }

      /**
       *Also apply colors on chart
       */
      newSeriesObject.data = _.map(newSeriesObject.data, dataObject => {
        const newDataObject = _.clone(dataObject);
        if (availableAxisOption.color !== '') {
          newDataObject.color = availableAxisOption.color;
        }
        return newDataObject;
      });
    }
    return newSeriesObject;
  });
}
