import { compact, find } from "lodash";
import { selectorFamily } from "recoil";
import { OrgUnitLevels } from "../../../../../core/state/orgUnit";
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

export const SubLevelOrgUnit = selectorFamily({
  key: "sub-level-items",
  get:
    (id: string) =>
    ({ get }) => {
      const { orgUnitSelection } = get<InterventionConfig>(InterventionState(id)) ?? {};
      if (orgUnitSelection.subLevel) {
        const levels = get(OrgUnitLevels);
        const orgUnitLevel = find(levels, ["id", orgUnitSelection.subLevel?.id]);
        return [`LEVEL-${orgUnitLevel?.level}`];
      }
      return ["USER_ORGUNIT_CHILDREN"];
    },
});

export const OrgUnit = selectorFamily({
  key: "sub-level-items",
  get:
    (id: string) =>
    ({ get }) => {
      const { orgUnitSelection } = get<InterventionConfig>(InterventionState(id)) ?? {};
      let orgUnits;
      if (orgUnitSelection?.orgUnit?.type === "USER_ORGANISATION_UNIT") {
        orgUnits = ["USER_ORGUNIT"];
      } else {
        orgUnits = [orgUnitSelection.orgUnit?.id];
      }
      return compact(orgUnits);
    },
});
