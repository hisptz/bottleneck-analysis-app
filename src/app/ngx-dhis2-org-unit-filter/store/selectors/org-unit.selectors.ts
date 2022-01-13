import { createSelector } from "@ngrx/store";
import * as _ from "lodash";

import { getOrgUnitChildrenIds } from "../../helpers/get-org-unit-children-ids.helper";
import { updateOrgUnitListWithSelectionStatus } from "../../helpers/update-org-unit-list-with-selection-status.helper";
import { OrgUnit } from "../../models/org-unit.model";
import {
  getOrgUnitFilterState,
  OrgUnitFilterState,
} from "../reducers/org-unit-filter.reducer";
import { orgUnitGroupAdapter } from "../reducers/org-unit-group.reducer";
import { OrgUnitState } from "../reducers/org-unit.reducer";

export const getOrgUnitState = createSelector(
  getOrgUnitFilterState,
  (state: OrgUnitFilterState) => state.orgUnit
);

export const { selectAll: getOrgUnits } =
  orgUnitGroupAdapter.getSelectors(getOrgUnitState);

export const getOrgUnitLoading = createSelector(
  getOrgUnitState,
  (orgUnitState: OrgUnitState) => orgUnitState.loading
);

export const getOrgUnitLoadingInitiated = createSelector(
  getOrgUnitState,
  (orgUnitState: OrgUnitState) => orgUnitState.loadInitiated
);

export const getOrgUnitLoaded = createSelector(
  getOrgUnitState,
  (orgUnitState: OrgUnitState) => orgUnitState.loaded
);

export const getHighestLevelOrgUnitIds = createSelector(
  getOrgUnitState,
  (orgUnitState: OrgUnitState) => orgUnitState.highestLevelOrgUnits
);

export const getOrgUnitById = (orgUnitId) =>
  createSelector(getOrgUnits, (orgUnits: OrgUnit[]) => {
    const orgUnit = _.find(orgUnits, ["id", orgUnitId]);
    return orgUnit
      ? { ...orgUnit, children: getOrgUnitChildrenIds(orgUnits, orgUnit) }
      : null;
  });

export const getTopSelectedOrgUnitLevel = (selectedOrgUnits) =>
  createSelector(getOrgUnits, (orgUnits: OrgUnit[]) => {
    const selectedOrgUnitsWithLevels: OrgUnit[] = _.sortBy(
      _.map(selectedOrgUnits || [], (orgUnit) =>
        _.find(orgUnits, ["id", orgUnit.id])
      ),
      "level"
    );

    return selectedOrgUnitsWithLevels[0]
      ? selectedOrgUnitsWithLevels[0].level
      : 0;
  });

export const getUserOrgUnits = createSelector(
  getOrgUnits,
  (orgUnits: OrgUnit[]) =>
    (orgUnits || []).filter(
      (orgUnit: OrgUnit) =>
        orgUnit &&
        orgUnit.id &&
        orgUnit.id.toString().indexOf("USER_ORGUNIT") !== -1
    )
);

export const getUserOrgUnitsBasedOnOrgUnitsSelected = (selectedOrgUnits) =>
  createSelector(getUserOrgUnits, (userOrgUnits) =>
    updateOrgUnitListWithSelectionStatus(userOrgUnits, selectedOrgUnits)
  );

export const getSelectedOrgUnitChildrenCount = (orgUnitId, selectedOrgUnits) =>
  createSelector(
    getOrgUnits,
    (orgUnits: OrgUnit[]) =>
      (orgUnits || []).filter((orgUnitChild: OrgUnit) => {
        return (
          orgUnitChild &&
          orgUnitChild.id !== orgUnitId &&
          orgUnitChild.path &&
          orgUnitChild.path.indexOf(orgUnitId) !== -1 &&
          selectedOrgUnits.find(
            (selectedOrgUnit: any) => selectedOrgUnit.id === orgUnitChild.id
          )
        );
      }).length
  );
