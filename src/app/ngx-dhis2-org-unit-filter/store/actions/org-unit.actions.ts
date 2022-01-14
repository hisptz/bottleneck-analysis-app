import { createAction, props } from "@ngrx/store";

import { OrgUnitFilterConfig } from "../../models/org-unit-filter-config.model";
import { OrgUnit } from "../../models/org-unit.model";

export const loadOrgUnits = createAction(
  "[OrgUnit] load organisation units",
  props<{ orgUnitFilterConfig: OrgUnitFilterConfig }>()
);

export const initiateOrgUnits = createAction(
  "[OrgUnit] load organisation units initiated"
);

export const addOrgUnits = createAction(
  "[OrgUnit] add organisation units",
  props<{ orgUnits: OrgUnit[] }>()
);

export const loadOrgUnitFail = createAction(
  "[OrgUnit] load organisation units fail",
  props<{ error: any }>()
);

export const setHighestLevelOrgUnits = createAction(
  "[OrgUnit] set highest level orgunits",
  props<{ highestLevelOrgUnits: string[] }>()
);
