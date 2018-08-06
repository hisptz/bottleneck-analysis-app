import { Action } from '@ngrx/store';
import { OrgUnit } from '../../models';
import { OrgUnitFilterConfig } from '../../models/org-unit-filter-config.model';
export enum OrgUnitActionsTypes {
  LoadOrgUnits = '[OrgUnit] load organisation units',
  LoadOrgUnitsInitiated = '[OrgUnit] load organisation units initiated',
  LoadOrgUnitsFail = '[OrgUnit] load organisation units fail',
  AddOrgUnits = '[OrgUnit] add organisation units'
}

export class LoadOrgUnitsAction implements Action {
  readonly type = OrgUnitActionsTypes.LoadOrgUnits;
  constructor(public orgUnitFilterConfig: OrgUnitFilterConfig) {}
}

export class LoadOrgUnitsInitiatedAction implements Action {
  readonly type = OrgUnitActionsTypes.LoadOrgUnitsInitiated;
}

export class AddOrgUnitsAction implements Action {
  readonly type = OrgUnitActionsTypes.AddOrgUnits;
  constructor(public OrgUnits: OrgUnit[]) {}
}

export class LoadOrgUnitsFailAction implements Action {
  readonly type = OrgUnitActionsTypes.LoadOrgUnitsFail;
  constructor(public error: any) {}
}

export type OrgUnitActions =
  | LoadOrgUnitsAction
  | AddOrgUnitsAction
  | LoadOrgUnitsFailAction
  | LoadOrgUnitsInitiatedAction;
