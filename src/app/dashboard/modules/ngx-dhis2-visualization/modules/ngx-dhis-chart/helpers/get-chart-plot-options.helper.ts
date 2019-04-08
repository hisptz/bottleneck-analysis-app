import { getAllowedChartType } from './get-allowed-chart-types.helper';

export function getPlotOptions(chartConfiguration: any) {
  const plotOptionChartType = getAllowedChartType(chartConfiguration.type);

  // TODO: Find best way to attach custom events into the chart
  const plotOptions = {
    series: {
      cursor: 'pointer',
      point: {
        events: {
          click: function() {
            this.update({ color: '#f00' }, true, false);
          }
        }
      }
    }
  };
  if (plotOptionChartType) {
    switch (plotOptionChartType) {
      case 'solidgauge':
        plotOptions[plotOptionChartType] = {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        };
        break;
      case 'gauge':
        plotOptions[plotOptionChartType] = {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        };
        break;
      case 'pie':
        plotOptions[plotOptionChartType] = {
          borderWidth: 0,
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: !chartConfiguration.hideLegend
        };
        break;
      default:
        plotOptions[
          plotOptionChartType !== '' ? plotOptionChartType : 'series'
        ] = {
          showInLegend: !chartConfiguration.hideLegend,
          colorByPoint: true
        };

        /**
         * Set attributes for stacked charts
         */
        if (
          chartConfiguration.type === 'stacked_column' ||
          chartConfiguration.type === 'stacked_bar' ||
          chartConfiguration.type === 'area'
        ) {
          plotOptions[
            plotOptionChartType
          ].stacking = chartConfiguration.percentStackedValues
            ? 'percent'
            : 'normal';
        }

        if (chartConfiguration.type === 'dotted') {
          plotOptions['line'] = {
            lineWidth: 0,
            states: {
              hover: {
                enabled: false
              }
            }
          };
        }

        break;
    }
  }
  return plotOptions;
}
