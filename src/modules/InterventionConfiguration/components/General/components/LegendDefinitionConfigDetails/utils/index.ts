import { DataItem, Group, LegendDefinition } from "../../../../../../../shared/interfaces/interventionConfig";
import { cloneDeep, filter, set } from "lodash";
import { generateLegendDefaults } from "../../../../Determinants/components/DeterminantArea/utils/indicators";

export function resetLegends(groups: Group[], legendDefinitions: LegendDefinition[]) {
  const newGroups = cloneDeep(groups);

  newGroups.forEach((group: Group) => {
    group.items.forEach((indicator: DataItem) => {
      set(
        indicator,
        "legends",
        generateLegendDefaults(
          filter(legendDefinitions, (definition: LegendDefinition) => !definition.isDefault),
          100
        )
      );
    });
  });

  return newGroups;
}
