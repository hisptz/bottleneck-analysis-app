export function getSanitizedLegendSet(legendSet: any) {
  const startValue = legendSet.startValue !== '' ? legendSet.startValue : '-';
  const endValue = legendSet.endValue !== '' ? legendSet.endValue : '-';
  return {
    ...legendSet,
    startValue: !isNaN(startValue) ? parseFloat(startValue) : '-',
    endValue: !isNaN(endValue) ? parseFloat(endValue) : '-'
  };
}
