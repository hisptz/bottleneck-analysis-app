import { find } from "lodash";
import { selectorFamily } from "recoil";
import { OrgUnitLevels } from "../../../../../core/state/orgUnit";
import { UserOrganisationUnit } from "../../../../../core/state/user";
import { DataItem, InterventionConfig } from "../../../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../state/selections";

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
      const periodSelection = get(InterventionPeriodState(id));
      return periodSelection?.id;
    },
});

export const SubLevelOrgUnit = selectorFamily({
  key: "sub-level-items",
  get:
    (id: string) =>
    ({ get }) => {
      const userOrgUnit = get(UserOrganisationUnit);
      const orgUnit = get(InterventionOrgUnitState(id));
      if (!orgUnit || orgUnit.id === userOrgUnit?.id) {
        const { orgUnitSelection } = get<InterventionConfig>(InterventionState(id)) ?? {};
        if (orgUnitSelection.subLevel) {
          const levels = get(OrgUnitLevels);
          const orgUnitLevel = find(levels, ["id", orgUnitSelection.subLevel?.id]);
          if (orgUnitLevel) {
            return [`LEVEL-${orgUnitLevel?.level}`];
          }
          return [`LEVEL-${orgUnitSelection.subLevel?.level}`];
        }
        return ["USER_ORGUNIT_CHILDREN"];
      }
      console.log(orgUnit);
      return [`LEVEL-${orgUnit?.level + 1}`];
    },
});

export const OrgUnit = selectorFamily({
  key: "sub-level-items",
  get:
    (id: string) =>
    ({ get }) => {
      const orgUnitSelection = get(InterventionOrgUnitState(id));
      if (orgUnitSelection) {
        return [orgUnitSelection.id];
      }
      return ["USER_ORGUNIT"];
    },
});
