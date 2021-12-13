import { isEmpty } from "lodash";
import { Legend, LegendDefinition } from "../../../../../../../shared/interfaces/interventionConfig";

export function generateLegendDefaults(legendDefinitions: Array<LegendDefinition>, weight: number): Array<Legend> {
  if (!isEmpty(legendDefinitions)) {
    const actualWeight = weight ?? 100; //sets 100 as the default weight
    const range = actualWeight / legendDefinitions?.length;
    const values = [];
    let legendDefinitionIterator = legendDefinitions.length - 1;
    for (let i = 0; i < actualWeight; i += range) {
      const { id } = legendDefinitions[legendDefinitionIterator];
      values.push({
        startValue: Math.floor(i),
        endValue: Math.floor(i + range),
        id,
      });
      legendDefinitionIterator--;
    }
    return values.reverse();
  }
  console.log("Empty");
  return [];
}
