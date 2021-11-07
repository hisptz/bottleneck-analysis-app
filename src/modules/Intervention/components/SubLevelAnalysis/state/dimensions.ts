import { compact } from "lodash";
import { selectorFamily } from "recoil";
import { DataItem, InterventionConfig } from "../../../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../../state/intervention";

export const DataItems = selectorFamily<Array<string>, string>({
  key: "sub-level-data-items",
  get:
    (id: string) =>
    ({ get }): Array<string> => {
      const { dataSelection } = get<InterventionConfig>(InterventionState(id)) ?? {};
      const groups = dataSelection.groups ?? [];
      return groups
        .reduce<Array<DataItem>>((acc, group) => {
          const { items } = group;
          return [...acc, ...items];
        }, [])
        .map(({ id }) => id);
    },
});

export const Period = selectorFamily({
  key: "sub-level-items",
  get:
    (id: string) =>
    ({ get }) => {
      const { periodSelection } = get<InterventionConfig>(InterventionState(id)) ?? {};
      return periodSelection.id;
    },
});

export const OrgUnit = selectorFamily({
  key: "sub-level-items",
  get:
    (id: string) =>
    ({ get }) => {
      const { orgUnitSelection } = get<InterventionConfig>(InterventionState(id)) ?? {};
      const orgUnits = [orgUnitSelection.orgUnit?.id];
      if (orgUnitSelection.subLevelAnalysisOrgUnitLevel) {
        orgUnits.push(orgUnitSelection.subLevelAnalysisOrgUnitLevel?.id);
      }

      return compact(orgUnits);
    },
});
