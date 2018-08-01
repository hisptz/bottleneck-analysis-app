import { Action } from '@ngrx/store';
import { OrgUnitLevel } from '../../models';
export enum OrgUnitLevelActionsTypes {
  LoadOrgUnitLevels = '[OrgUnitLevel] load organisation unit levels',
  LoadOrgUnitLevelsFail = '[OrgUnitLevel] load organisation unit levels fail',
  AddOrgUnitLevels = '[OrgUnitLevel] add organisation unit levels'
}

export class LoadOrgUnitLevelsAction implements Action {
  readonly type = OrgUnitLevelActionsTypes.LoadOrgUnitLevels;
}

export class AddOrgUnitLevelsAction implements Action {
  readonly type = OrgUnitLevelActionsTypes.AddOrgUnitLevels;
  constructor(public orgUnitLevels: OrgUnitLevel[]) {}
}

export class LoadOrgUnitLevelsFailAction implements Action {
  readonly type = OrgUnitLevelActionsTypes.LoadOrgUnitLevelsFail;
  constructor(public error: any) {}
}

export type OrgUnitLevelActions =
  | LoadOrgUnitLevelsAction
  | AddOrgUnitLevelsAction
  | LoadOrgUnitLevelsFailAction;
