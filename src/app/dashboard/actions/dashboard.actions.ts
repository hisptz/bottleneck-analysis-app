import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Dashboard } from '../models/dashboard.model';

export enum DashboardActionTypes {
  LoadDashboards = '[Dashboard] Load Dashboards',
  AddDashboard = '[Dashboard] Add Dashboard',
  UpsertDashboard = '[Dashboard] Upsert Dashboard',
  AddDashboards = '[Dashboard] Add Dashboards',
  UpsertDashboards = '[Dashboard] Upsert Dashboards',
  UpdateDashboard = '[Dashboard] Update Dashboard',
  UpdateDashboards = '[Dashboard] Update Dashboards',
  DeleteDashboard = '[Dashboard] Delete Dashboard',
  DeleteDashboards = '[Dashboard] Delete Dashboards',
  ClearDashboards = '[Dashboard] Clear Dashboards'
}

export class LoadDashboards implements Action {
  readonly type = DashboardActionTypes.LoadDashboards;

  constructor(public payload: { dashboards: Dashboard[] }) {}
}

export class AddDashboard implements Action {
  readonly type = DashboardActionTypes.AddDashboard;

  constructor(public payload: { dashboard: Dashboard }) {}
}

export class UpsertDashboard implements Action {
  readonly type = DashboardActionTypes.UpsertDashboard;

  constructor(public payload: { dashboard: Dashboard }) {}
}

export class AddDashboards implements Action {
  readonly type = DashboardActionTypes.AddDashboards;

  constructor(public payload: { dashboards: Dashboard[] }) {}
}

export class UpsertDashboards implements Action {
  readonly type = DashboardActionTypes.UpsertDashboards;

  constructor(public payload: { dashboards: Dashboard[] }) {}
}

export class UpdateDashboard implements Action {
  readonly type = DashboardActionTypes.UpdateDashboard;

  constructor(public payload: { dashboard: Update<Dashboard> }) {}
}

export class UpdateDashboards implements Action {
  readonly type = DashboardActionTypes.UpdateDashboards;

  constructor(public payload: { dashboards: Update<Dashboard>[] }) {}
}

export class DeleteDashboard implements Action {
  readonly type = DashboardActionTypes.DeleteDashboard;

  constructor(public payload: { id: string }) {}
}

export class DeleteDashboards implements Action {
  readonly type = DashboardActionTypes.DeleteDashboards;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearDashboards implements Action {
  readonly type = DashboardActionTypes.ClearDashboards;
}

export type DashboardActions =
 LoadDashboards
 | AddDashboard
 | UpsertDashboard
 | AddDashboards
 | UpsertDashboards
 | UpdateDashboard
 | UpdateDashboards
 | DeleteDashboard
 | DeleteDashboards
 | ClearDashboards;
