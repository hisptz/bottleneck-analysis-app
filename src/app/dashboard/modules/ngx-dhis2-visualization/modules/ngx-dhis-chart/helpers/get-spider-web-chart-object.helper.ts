import * as _ from 'lodash';
import { getChartAxisItems } from './get-chart-axis-items.helper';
import { getChartSeries } from './get-chart-series.helper';
import { getChartPaneOptions } from './get-chart-pane-options.helper';
import { getChartYAxisOptions } from './get-chart-y-axis-options.helper';
import { getSortedChartSeries } from './get-sorted-chart-series.helper';
import { getChartXAxisOptions } from './get-chart-x-axis-options.helper';
import { getSanitizedChartXAxisCategories } from './get-sanitized-chart-x-axis-categories.helper';
export function getSpiderWebChartObject(
  initialChartObject: any,
  analyticsObject: any,
  chartConfiguration: any
) {
  const newChartObject = _.clone(initialChartObject);
  const yAxisSeriesItems: any[] = getChartAxisItems(
    analyticsObject,
    chartConfiguration.yAxisType
  );

  /**
   * Get pane attribute
   */
  newChartObject.pane = _.assign(
    {},
    getChartPaneOptions(chartConfiguration.type)
  );

  /**
   * Get y axis options
   */
  newChartObject.yAxis = _.assign([], getChartYAxisOptions(chartConfiguration));

  /**
   * Sort the corresponding series
   */
  const sortedSeries = getSortedChartSeries(
    getChartSeries(
      analyticsObject,
      getChartAxisItems(analyticsObject, chartConfiguration.xAxisType, true),
      yAxisSeriesItems,
      chartConfiguration
    ),
    chartConfiguration.cumulativeValues ? -1 : chartConfiguration.sortOrder
  );

  /**
   * Get series
   */
  newChartObject.series = _.assign([], sortedSeries);

  /**
   * Get refined x axis options
   */
  newChartObject.xAxis = getChartXAxisOptions(
    getSanitizedChartXAxisCategories(newChartObject.series),
    chartConfiguration
  );

  return newChartObject;
}
