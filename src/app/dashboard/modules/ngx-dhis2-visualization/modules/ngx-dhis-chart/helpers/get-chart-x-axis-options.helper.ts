import * as _ from 'lodash';
import { ChartConfiguration } from '../models';
export function getChartXAxisOptions(
  xAxisCategories: any[],
  chartConfiguration: ChartConfiguration
) {
  let xAxisOptions = {};

  switch (chartConfiguration.type) {
    case 'radar':
      xAxisOptions = _.assign(
        {},
        {
          categories: xAxisCategories,
          tickmarkPlacement: 'on',
          lineWidth: 0,
        }
      );
      break;
    default:
      xAxisOptions = _.assign(
        {},
        {
          categories: xAxisCategories,
          labels: {
            rotation: 0,
            useHTML: true,
            allowOverlap: true,
            style: {
              color: '#000000',
              fontWeight: 'normal',
              fontSize: '12px',
              wordBreak: 'break-all',
              textOverflow: 'allow',
            },
          },
        }
      );
      break;
  }

  return xAxisOptions;
}
