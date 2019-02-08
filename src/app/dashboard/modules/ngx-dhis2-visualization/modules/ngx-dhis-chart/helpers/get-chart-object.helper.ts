import * as _ from 'lodash';

import { ChartConfiguration } from '../models';
import { getInitialChartObject } from './get-initial-chart-object.helper';
import { getOtherChartObject } from './get-other-chart-object.helper';
import { getPieChartObject } from './get-pie-chart-object.helper';
import { getSanitizedAnalyticsBasedOnConfiguration } from './get-sanitized-analytics-based-on-chart-configuration.helper';
import { getSolidGaugeChartObject } from './get-solid-gauge-chart-object.helper';
import { getSpiderWebChartObject } from './get-spider-web-chart-object.helper';
import { getSanitizedChartObject } from './get-sanitized-chart-object.helper';

export function getChartObject(
  incomingAnalyticsObject: any,
  chartConfiguration: ChartConfiguration
): any {
  const analyticsObject = getSanitizedAnalyticsBasedOnConfiguration(
    incomingAnalyticsObject,
    chartConfiguration
  );

  let chartObject: any = getInitialChartObject(
    analyticsObject,
    chartConfiguration
  );

  /**
   * Extend chart options depending on type
   */

  switch (chartConfiguration.type) {
    case 'radar':
      chartObject = getSpiderWebChartObject(
        chartObject,
        analyticsObject,
        chartConfiguration
      );
      break;
    case 'solidgauge':
      chartObject = getSolidGaugeChartObject(
        chartObject,
        analyticsObject,
        chartConfiguration
      );
      break;
    case 'gauge':
      const newChartConfiguration = _.clone(chartConfiguration);
      newChartConfiguration.type = 'solidgauge';
      chartObject = getSolidGaugeChartObject(
        chartObject,
        analyticsObject,
        newChartConfiguration
      );
      break;
    case 'pie':
      chartObject = getPieChartObject(
        chartObject,
        analyticsObject,
        chartConfiguration
      );
      break;
    case 'combined':
      break;
    default:
      chartObject = getOtherChartObject(
        chartObject,
        analyticsObject,
        chartConfiguration
      );
      break;
  }

  return getSanitizedChartObject(chartObject, chartConfiguration);
}
