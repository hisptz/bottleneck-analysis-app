import { InterventionConfig, Legend } from "../../../shared/interfaces/interventionConfig";
import { sortBy } from "lodash";

export function validate(interventionConfig: InterventionConfig): boolean {
  return Boolean(interventionConfig.name);
}


export function validateLegends(legends: Legend[]): boolean {
  const sortedLegends = sortBy(legends, "endValue");

  return sortedLegends.every((legend, index) => {
    if (index === 0) {
      return true;
    }
    return legend.startValue === sortedLegends[index - 1].endValue;
  });
}
