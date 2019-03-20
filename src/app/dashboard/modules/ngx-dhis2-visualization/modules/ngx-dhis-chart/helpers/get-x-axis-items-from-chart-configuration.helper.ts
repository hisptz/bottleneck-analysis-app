import { ChartConfiguration } from '../models';
import * as _ from 'lodash';

export function getXAxisItemsFromChartConfiguration(
  chartConfiguration: ChartConfiguration
) {
  return (chartConfiguration ? chartConfiguration.xAxisType : []).map(
    (xAxisDimension: string) => {
      const dataSelection = _.find(
        chartConfiguration ? chartConfiguration.dataSelections : [],
        ['dimension', xAxisDimension === 'groups' ? 'dx' : xAxisDimension]
      );

      return dataSelection
        ? xAxisDimension === 'groups'
          ? dataSelection.groups
          : dataSelection.items
        : [];
    }
  );
}
