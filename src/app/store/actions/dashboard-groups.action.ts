import { Action } from '@ngrx/store';
import { DashboardGroups } from '../../dashboard/models/dashboard-groups.model';
import { User, SystemInfo } from '../../models';

export enum DashboardGroupsActionTypes {
  InitializeDashboardGroups = '[DashboardGroups] initialize dashboard group',
  LoadDashboardGroups = '[DashboardGroups] Load dashboard group',
  AddDashboardGroups = '[DashboardGroups] Add dashboard group',
  SetActiveDashboardGroup = '[DashboardGroups] Set Active Dashboard group',
  LoadDashboardGroupsFail = '[DashboardGroups] Load dashboard group fails'
}

export class InitializeDashboardGroupsAction implements Action {
  readonly type = DashboardGroupsActionTypes.InitializeDashboardGroups;
}

export class LoadDashboardGroupsAction implements Action {
  readonly type = DashboardGroupsActionTypes.LoadDashboardGroups;
  constructor(public currentUser: User, public systemInfo: SystemInfo) {}
}

export class SetActiveDashboardGroupsAction implements Action {
  readonly type = DashboardGroupsActionTypes.SetActiveDashboardGroup;
  constructor(public activeGroup: string) {}
}

export class AddDashboardGroupsAction implements Action {
  readonly type = DashboardGroupsActionTypes.AddDashboardGroups;
  constructor(public dashboardGroups: DashboardGroups, public currentUser: User, public systemInfo: SystemInfo) {}
}
export class LoadDashboardGroupsFailAction implements Action {
  readonly type = DashboardGroupsActionTypes.LoadDashboardGroupsFail;
  constructor(public error: any, public currentUser: User) {}
}

export type DashboardGroupsActions =
  | InitializeDashboardGroupsAction
  | LoadDashboardGroupsAction
  | LoadDashboardGroupsFailAction
  | SetActiveDashboardGroupsAction
  | AddDashboardGroupsAction;
