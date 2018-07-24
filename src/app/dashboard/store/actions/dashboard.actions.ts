import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Dashboard } from '../../models/dashboard.model';
import { User, ErrorMessage } from '../../../models';

export enum DashboardActionTypes {
  LoadDashboards = '[Dashboard] Load Dashboards',
  LoadDashboardsFail = '[Dashboard] Load Dashboards fail',
  LoadDashboardsSuccess = '[Dashboard] Load Dashboards success',
  AddDashboard = '[Dashboard] Add Dashboard',
  AddDashboardItem = '[Dashboard] Add Dashboard item',
  AddDashboardItemSuccess = '[Dashboard] Add Dashboard item success',
  AddDashboardItemFail = '[Dashboard] Add Dashboard item fail',
  UpsertDashboard = '[Dashboard] Upsert Dashboard',
  AddDashboards = '[Dashboard] Add Dashboards',
  UpsertDashboards = '[Dashboard] Upsert Dashboards',
  UpdateDashboard = '[Dashboard] Update Dashboard',
  UpdateDashboards = '[Dashboard] Update Dashboards',
  DeleteDashboard = '[Dashboard] Delete Dashboard',
  DeleteDashboards = '[Dashboard] Delete Dashboards',
  ClearDashboards = '[Dashboard] Clear Dashboards',
  SetCurrentDashboard = '[Dashboard] Set current dashboard',
  ToggleDashboardBookmark = '[Dashboard] Toggle dashboard bookmark status',
  ToggleDashboardBookmarkSuccess = '[Dashboard] Toggle dashboard bookmark success',
  ToggleDashboardBookmarkFail = '[Dashboard] Toggle dashboard bookmark fail'
}

export class LoadDashboardsAction implements Action {
  readonly type = DashboardActionTypes.LoadDashboards;

  constructor(public currentUser: User) {}
}

export class LoadDashboardsFailAction implements Action {
  readonly type = DashboardActionTypes.LoadDashboardsFail;
  constructor(public error: ErrorMessage) {}
}

export class LoadDashboardsSuccessAction implements Action {
  readonly type = DashboardActionTypes.LoadDashboardsSuccess;
  constructor(
    public dashboards: any[],
    public currentUser: User,
    public routeUrl: string
  ) {}
}

export class AddDashboard implements Action {
  readonly type = DashboardActionTypes.AddDashboard;

  constructor(public payload: { dashboard: Dashboard }) {}
}

export class UpsertDashboard implements Action {
  readonly type = DashboardActionTypes.UpsertDashboard;

  constructor(public payload: { dashboard: Dashboard }) {}
}

export class AddDashboardsAction implements Action {
  readonly type = DashboardActionTypes.AddDashboards;

  constructor(public dashboards: Dashboard[]) {}
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

export class SetCurrentDashboardAction implements Action {
  readonly type = DashboardActionTypes.SetCurrentDashboard;
  constructor(public id: string) {}
}

export class ToggleDashboardBookmarkAction implements Action {
  readonly type = DashboardActionTypes.ToggleDashboardBookmark;
  constructor(
    public id: string,
    public supportBookmark: boolean,
    public changes: Partial<Dashboard>
  ) {}
}

export class ToggleDashboardBookmarkSuccessAction implements Action {
  readonly type = DashboardActionTypes.ToggleDashboardBookmarkSuccess;
  constructor(public id: string, public changes: Partial<Dashboard>) {}
}

export class ToggleDashboardBookmarkFailAction implements Action {
  readonly type = DashboardActionTypes.ToggleDashboardBookmarkFail;
  constructor(
    public id: string,
    public changes: Partial<Dashboard>,
    public error: any
  ) {}
}

export class AddDashboardItemAction implements Action {
  readonly type = DashboardActionTypes.AddDashboardItem;
  constructor(public dashboardId: string, public dashboardItem: any) {}
}

export class AddDashboardItemSuccessAction implements Action {
  readonly type = DashboardActionTypes.AddDashboardItemSuccess;
  constructor(public dashboardId: string, public dashboardItem: any) {}
}

export class AddDashboardItemFailAction implements Action {
  readonly type = DashboardActionTypes.AddDashboardItemFail;
  constructor(public dashboardId: string, public error: ErrorMessage) {}
}

export type DashboardActions =
  | LoadDashboardsAction
  | AddDashboardItemAction
  | AddDashboardItemSuccessAction
  | AddDashboardItemFailAction
  | LoadDashboardsFailAction
  | LoadDashboardsSuccessAction
  | AddDashboard
  | UpsertDashboard
  | AddDashboardsAction
  | UpsertDashboards
  | UpdateDashboard
  | UpdateDashboards
  | DeleteDashboard
  | DeleteDashboards
  | ClearDashboards
  | SetCurrentDashboardAction
  | ToggleDashboardBookmarkAction
  | ToggleDashboardBookmarkSuccessAction
  | ToggleDashboardBookmarkFailAction;
