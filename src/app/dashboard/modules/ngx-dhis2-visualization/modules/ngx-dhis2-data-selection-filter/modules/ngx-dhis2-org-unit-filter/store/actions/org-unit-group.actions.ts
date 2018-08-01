import { Action } from '@ngrx/store';
import { OrgUnitGroup } from '../../models';
export enum OrgUnitGroupActionsTypes {
  LoadOrgUnitGroups = '[OrgUnitGroup] load organisation unit groups',
  LoadOrgUnitGroupsFail = '[OrgUnitGroup] load organisation unit groups fail',
  AddOrgUnitGroups = '[OrgUnitGroup] add organisation unit groups'
}

export class LoadOrgUnitGroupsAction implements Action {
  readonly type = OrgUnitGroupActionsTypes.LoadOrgUnitGroups;
}

export class AddOrgUnitGroupsAction implements Action {
  readonly type = OrgUnitGroupActionsTypes.AddOrgUnitGroups;
  constructor(public OrgUnitGroups: OrgUnitGroup[]) {}
}

export class LoadOrgUnitGroupsFailAction implements Action {
  readonly type = OrgUnitGroupActionsTypes.LoadOrgUnitGroupsFail;
  constructor(public error: any) {}
}

export type OrgUnitGroupActions =
  | LoadOrgUnitGroupsAction
  | AddOrgUnitGroupsAction
  | LoadOrgUnitGroupsFailAction;
