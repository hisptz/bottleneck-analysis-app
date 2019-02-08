export function getChartLegendOptions(chartConfiguration: any) {
  return {
    align: chartConfiguration.legendAlign,
    reversed: chartConfiguration.reverseLegend,
    layout:
      chartConfiguration.legendAlign === 'right' ||
      chartConfiguration.legendAlign === 'left'
        ? 'vertical'
        : 'horizontal',
    y:
      chartConfiguration.legendAlign === 'top'
        ? 0
        : chartConfiguration.legendAlign === 'bottom'
        ? 25
        : 0
  };
}
