import { find } from "lodash";

export function getXAxisItemsFromChartConfiguration(chartConfiguration: any) {
  return (chartConfiguration ? chartConfiguration.xAxisType : []).map((xAxisDimension: string) => {
    const dataSelection = find(chartConfiguration ? chartConfiguration.dataSelections : [], ["dimension", xAxisDimension === "groups" ? "dx" : xAxisDimension]);
    return dataSelection ? (xAxisDimension === "groups" ? dataSelection.groups : dataSelection.items) : [];
  });
}
