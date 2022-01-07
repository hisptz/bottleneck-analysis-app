import { find, forEach } from "lodash";
import { selectorFamily } from "recoil";
import { LastOrgUnitLevel, OrgUnitLevels } from "../../../../../core/state/orgUnit";
import { UserOrganisationUnit } from "../../../../../core/state/user";
import { DataItem, InterventionConfig } from "../../../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../state/selections";

export const DataItems = selectorFamily<{ functions: Array<string>; dataItems: Array<string> }, string>({
  key: "sub-level-data-items",
  get:
    (id: string) =>
    ({ get }): { functions: Array<string>; dataItems: Array<string> } => {
      const { dataSelection } = get<InterventionConfig | undefined>(InterventionState(id)) ?? {};
      if (!dataSelection) {
        return { functions: [], dataItems: [] };
      }
      const groups = dataSelection.groups ?? [];
      const functions: DataItem[] = [];
      const dataItems: DataItem[] = [];

      forEach(groups, (group) => {
        const { items } = group ?? {};
        forEach(items, (item) => {
          if (item.type === "CUSTOMFUNCTION") {
            functions.push(item);
          } else {
            dataItems.push(item);
          }
        });
      });

      return {
        dataItems: dataItems.map(({ id }) => id),
        functions: functions.map(({ id }) => id),
      };
    },
});

export const Period = selectorFamily({
  key: "sub-level-period",
  get:
    (id: string) =>
    ({ get }) => {
      const periodSelection = get(InterventionPeriodState(id));
      return periodSelection?.id;
    },
});

/*

How the sub-level org units are determined
 - if filter is off and subLevel is not set, => USER_ORGUNIT_CHILDREN
 - if filter is off and subLevel is set => LEVEL_{selected level}
 - if filter is off and subLevel is set but higher than user's level => ? user's level ?
 - if filter is on => LEVEL_{selectedOrgUnitLevel + 1} (check if  selectedOrgUnitLevel + 1 exists)
 */

export const SubLevelOrgUnit = selectorFamily({
  key: "sub-level-orgUnits",
  get:
    (id: string) =>
    ({ get }) => {
      const userOrgUnit = get(UserOrganisationUnit);
      const lastOrgUnitLevel = get(LastOrgUnitLevel)?.level;
      const orgUnit = get(InterventionOrgUnitState(id));
      if (!orgUnit) {
        return ["USER_ORGUNIT_CHILDREN"];
      }
      if (!orgUnit || orgUnit.id === userOrgUnit?.id) {
        const { orgUnitSelection } = get<InterventionConfig | undefined>(InterventionState(id)) ?? {};
        if (!orgUnitSelection) {
          return ["USER_ORGUNIT_CHILDREN"];
        }

        if (orgUnitSelection.subLevel) {
          if (userOrgUnit) {
            if (userOrgUnit?.level < orgUnitSelection.subLevel.level) {
              const levels = get(OrgUnitLevels);
              const orgUnitLevel = find(levels, ["id", orgUnitSelection.subLevel?.id]);
              if (orgUnitLevel) {
                return [`LEVEL-${orgUnitLevel?.level}`];
              }
              return [`LEVEL-${orgUnitSelection?.subLevel?.level}`];
            }
          }
        }
        if (userOrgUnit?.level === lastOrgUnitLevel) {
          return ["USER_ORGUNIT"];
        }
        return ["USER_ORGUNIT_CHILDREN"];
      }
      if (orgUnit.level === lastOrgUnitLevel) {
        return [`LEVEL-${orgUnit?.level}`];
      }
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
