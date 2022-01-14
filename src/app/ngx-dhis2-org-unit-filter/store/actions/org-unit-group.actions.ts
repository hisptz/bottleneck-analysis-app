import { createAction, props } from "@ngrx/store";

import { OrgUnitGroup } from "../../models/org-unit-group.model";

export const initiateOrgUnitGroups = createAction(
  "[OrgUnitGroup] initiate organisation unit groups"
);

export const loadOrgUnitGroups = createAction(
  "[OrgUnitGroup] load organisation unit groups"
);

export const addOrgUnitGroups = createAction(
  "[OrgUnitGroup] add organisation unit groups",
  props<{ orgUnitGroups: OrgUnitGroup[] }>()
);

export const loadOrgUnitGroupsFail = createAction(
  "[OrgUnitGroup] load organisation unit groups fail",
  props<{ error: any }>()
);
