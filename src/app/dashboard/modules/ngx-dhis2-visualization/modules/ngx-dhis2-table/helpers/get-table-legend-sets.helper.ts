const USE_BY_DATA_ITEM_LEGEND = 'BY_DATA_ITEM';
export function getTableLegendSets(
  dataItem,
  legendClasses,
  legendSets,
  configuration,
  metaData
) {
  const { legendDisplayStrategy } = configuration;
  const { items } = metaData;

  if (legendDisplayStrategy === USE_BY_DATA_ITEM_LEGEND) {
    const dx = dataItem.find(dItem => dItem.type === 'dx');
    const legendSetId =
      dx && dx.value && items[dx.value] && items[dx.value]['legendSet'];
    const legendSet =
      legendSetId &&
      legendSets &&
      legendSets.find(({ id }) => id === legendSetId);
    return legendSet && legendSet.legends;
  }
  return legendClasses;
}
