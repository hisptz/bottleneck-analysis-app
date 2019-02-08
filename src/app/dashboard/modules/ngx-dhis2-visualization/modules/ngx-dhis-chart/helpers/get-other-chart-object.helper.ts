import * as _ from 'lodash';
import { getChartAxisItems } from './get-chart-axis-items.helper';
import { getSortedChartSeries } from './get-sorted-chart-series.helper';
import { getChartSeries } from './get-chart-series.helper';
import { getChartSeriesWithAxisOptions } from './get-chart-series-with-axis-options.helper';
import { getChartYAxisOptions } from './get-chart-y-axis-options.helper';
import { getChartXAxisOptions } from './get-chart-x-axis-options.helper';
import { getSanitizedChartXAxisCategories } from './get-sanitized-chart-x-axis-categories.helper';

export function getOtherChartObject(
  initialChartObject: any,
  analyticsObject: any,
  chartConfiguration: any
): any {
  const yAxisSeriesItems: any[] = getChartAxisItems(analyticsObject, [
    chartConfiguration.yAxisType
  ]);

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
   * Update series with axis options
   */
  const seriesWithAxisOptions = getChartSeriesWithAxisOptions(
    sortedSeries,
    chartConfiguration.multiAxisTypes
  );

  /**
   * Update colors by considering if series has data
   */
  const newColors: any[] = _.filter(
    _.map(seriesWithAxisOptions, seriesObject =>
      seriesObject.data[0] ? seriesObject.data[0].color : undefined
    ),
    color => color
  );

  return {
    ...initialChartObject,
    yAxis: getChartYAxisOptions(chartConfiguration),
    xAxis: getChartXAxisOptions(
      getSanitizedChartXAxisCategories(seriesWithAxisOptions),
      chartConfiguration.type
    ),
    colors: newColors.length > 0 ? newColors : initialChartObject.colors,
    series: seriesWithAxisOptions
  };
}
