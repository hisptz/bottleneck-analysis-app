import { createAction, props } from "@ngrx/store";

import { OrgUnitLevel } from "../../models/org-unit-level.model";

export const initiateOrgUnitLevels = createAction(
  "[OrgUnitLevel] initiate organisation unit levels"
);

export const loadOrgUnitLevels = createAction(
  "[OrgUnitLevel] load organisation unit levels"
);

export const addOrgUnitLevels = createAction(
  "[OrgUnitLevel] add organisation unit levels",
  props<{ orgUnitLevels: OrgUnitLevel[] }>()
);

export const loadOrgUnitLevelsFail = createAction(
  "[OrgUnitLevel] load organisation unit levels fail",
  props<{ error: any }>()
);
