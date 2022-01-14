import { createSelector, MemoizedSelector } from "@ngrx/store";
import {
  OrgUnitFilterState,
  getOrgUnitFilterState,
} from "../reducers/org-unit-filter.reducer";
import {
  selectAllOrgUnitLevels,
  getOrgUnitLevelLoadingState,
  getOrgUnitLevelLoadInitiatedState,
  getOrgUnitLevelLoadedState,
} from "../reducers/org-unit-level.reducer";
import { getTopSelectedOrgUnitLevel } from "./org-unit.selectors";
import { OrgUnitLevel } from "../../models/org-unit-level.model";

export const getOrgUnitLevelState = createSelector(
  getOrgUnitFilterState,
  (state: OrgUnitFilterState) => state.orgUnitLevel
);

export const getOrgUnitLevelLoadInitiated = createSelector(
  getOrgUnitLevelState,
  getOrgUnitLevelLoadInitiatedState
);

export const getOrgUnitLevelLoaded = createSelector(
  getOrgUnitLevelState,
  getOrgUnitLevelLoadedState
);

export const getOrgUnitLevelLoading = createSelector(
  getOrgUnitLevelState,
  getOrgUnitLevelLoadingState
);

export const getOrgUnitLevels = createSelector(
  getOrgUnitLevelState,
  selectAllOrgUnitLevels
);

export const getOrgUnitLevelBasedOnOrgUnitsSelected = (
  selectedOrgUnits: any[]
) =>
  createSelector(
    getOrgUnitLevels,
    getTopSelectedOrgUnitLevel(selectedOrgUnits),
    (orgUnitLevels: OrgUnitLevel[], topOrgUnitLevel: any) => {
      return (orgUnitLevels || [])
        .filter(
          (orgUnitLevel: OrgUnitLevel) => orgUnitLevel.level >= topOrgUnitLevel
        )
        .map((orgUnitLevel: OrgUnitLevel) => {
          return {
            ...orgUnitLevel,
            selected: (selectedOrgUnits || []).some(
              (selectedOrgUnit: any) =>
                selectedOrgUnit.id === "LEVEL-" + orgUnitLevel.level
            ),
          };
        });
    }
  );
