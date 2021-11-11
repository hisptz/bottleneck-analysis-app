import { find } from "lodash";
import { Legend, LegendDefinition } from "../../../../../shared/interfaces/interventionConfig";

function findLegend(value: string, legends: Array<Legend>, maxValue?: number): Legend | undefined {
  const max = maxValue ?? 100;
  return find(legends, ({ startValue, endValue }: Legend) => {
    if (max === endValue) {
      return +value >= startValue && +value <= endValue;
    }
    return +value >= startValue && +value < endValue;
  });
}

export function generateCellColor({
  value,
  legends,
  legendDefinitions,
  maxValue,
}: {
  legends: Array<Legend>;
  legendDefinitions: Array<LegendDefinition>;
  value?: string;
  maxValue?: number;
}) {
  if (!value) {
    const noDataLegend = find(legendDefinitions, ["name", "No data"]);
    return noDataLegend?.color ?? "#FFFFFF";
  }
  const legend = findLegend(value, legends, maxValue);
  const legendDefinition = find(legendDefinitions, ["id", legend?.id]);
  return legendDefinition?.color ?? "#FFFFFF";
}
