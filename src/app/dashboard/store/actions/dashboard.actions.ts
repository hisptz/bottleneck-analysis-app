import { Action } from '@ngrx/store';
import { Dashboard } from '../../models/dashboard.model';
import { SystemInfo } from '../../../models';
import { DashboardSettings } from '../../models/dashboard-settings.model';
import { Determinant } from '../../../models/determinant.model';
import { User, ErrorMessage } from '@iapps/ngx-dhis2-http-client';

export enum DashboardActionTypes {
  LoadDashboards = '[Dashboard] Load Dashboards',
  LoadDashboardsFail = '[Dashboard] Load Dashboards fail',
  LoadDashboardsSuccess = '[Dashboard] Load Dashboards success',
  AddDashboard = '[Dashboard] Add Dashboard',
  CreateDashboard = '[Dashboard] Create Dashboard',
  ManageDashboardItem = '[Dashboard] Add Dashboard item',
  ManageDashboardItemSuccess = '[Dashboard] Add Dashboard item success',
  ManageDashboardItemFail = '[Dashboard] Add Dashboard item fail',
  AddDashboards = '[Dashboard] Add Dashboards',
  UpdateDashboard = '[Dashboard] Update Dashboard',
  SaveDashboard = '[Dashboard] Save Dashboard',
  SaveDashboardSuccess = '[Dashboard] Save Dashboard success',
  SaveDashboardFail = '[Dashboard] Save Dashboard fail',
  ArchiveDashboard = '[Dashboard] Archive Dashboard',
  ArchiveDashboardSuccess = '[Dashboard] Archive Dashboard success',
  ArchiveDashboardFail = '[Dashboard] Archive Dashboard fail',
  UpdateDashboards = '[Dashboard] Update Dashboards',
  DeleteDashboard = '[Dashboard] Delete Dashboard',
  DeleteDashboardSuccess = '[Dashboard] Delete Dashboard success',
  DeleteDashboardFail = '[Dashboard] Delete Dashboard fail',
  RemoveDashboard = '[Dashboard] Remove Dashboard',
  ClearDashboards = '[Dashboard] Clear Dashboards',
  SetCurrentDashboard = '[Dashboard] Set current dashboard',
  SetCurrentVisualization = '[Dashboard] Set current visualization',
  ToggleDashboardBookmark = '[Dashboard] Toggle dashboard bookmark status',
  ToggleDashboardBookmarkSuccess = '[Dashboard] Toggle dashboard bookmark success',
  ToggleDashboardBookmarkFail = '[Dashboard] Toggle dashboard bookmark fail',
  AddNewUnsavedFavorite = '[Dashboard] Add new unsaved favorite',
  GlobalFilterChange = '[Dashboard] Global filter change',
  ResetDashboard = '[Dashboard] Reset dashboard changes',
  ChangeDashboardMenuHeight = '[Dashboard] change dashboard menu height',
}

export class LoadDashboardsAction implements Action {
  readonly type = DashboardActionTypes.LoadDashboards;

  constructor(
    public currentUser: User,
    public dashboardSettings: DashboardSettings,
    public systemInfo: SystemInfo,
    public determinants: Determinant[]
  ) {}
}

export class LoadDashboardsFailAction implements Action {
  readonly type = DashboardActionTypes.LoadDashboardsFail;
  constructor(public error: ErrorMessage) {}
}

export class LoadDashboardsSuccessAction implements Action {
  readonly type = DashboardActionTypes.LoadDashboardsSuccess;
  constructor(public dashboards: any[], public currentUser: User) {}
}

export class AddDashboardAction implements Action {
  readonly type = DashboardActionTypes.AddDashboard;

  constructor(public dashboard: Dashboard) {}
}

export class CreateDashboardAction implements Action {
  readonly type = DashboardActionTypes.CreateDashboard;

  constructor(
    public dashboard: any,
    public currentUser: User,
    public systemInfo: SystemInfo,
    public determinants: Determinant[]
  ) {}
}

export class AddDashboardsAction implements Action {
  readonly type = DashboardActionTypes.AddDashboards;

  constructor(public dashboards: Dashboard[]) {}
}

export class UpdateDashboardAction implements Action {
  readonly type = DashboardActionTypes.UpdateDashboard;

  constructor(public id: string, public changes: Partial<Dashboard>) {}
}

export class DeleteDashboard implements Action {
  readonly type = DashboardActionTypes.DeleteDashboard;

  constructor(public dashboard: Dashboard) {}
}

export class DeleteDashboardSuccess implements Action {
  readonly type = DashboardActionTypes.DeleteDashboardSuccess;
  constructor(public dashboard: Dashboard) {}
}

export class DeleteDashboardFail implements Action {
  readonly type = DashboardActionTypes.DeleteDashboardFail;
  constructor(public dashboard: Dashboard, public error: any) {}
}

export class RemoveDashboard implements Action {
  readonly type = DashboardActionTypes.RemoveDashboard;
  constructor(public dashboard: Dashboard) {}
}

export class ClearDashboards implements Action {
  readonly type = DashboardActionTypes.ClearDashboards;
}

export class SetCurrentDashboardAction implements Action {
  readonly type = DashboardActionTypes.SetCurrentDashboard;
  constructor(public id: string, public routeUrl?: string) {}
}

export class SetCurrentVisualizationAction implements Action {
  readonly type = DashboardActionTypes.SetCurrentVisualization;
  constructor(public visualizationId: string, public dashboardId: string) {}
}

export class ToggleDashboardBookmarkAction implements Action {
  readonly type = DashboardActionTypes.ToggleDashboardBookmark;
  constructor(
    public id: string,
    public supportBookmark: boolean,
    public changes: Partial<Dashboard>,
    public currentUser: User
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

export class ManageDashboardItemAction implements Action {
  readonly type = DashboardActionTypes.ManageDashboardItem;
  constructor(
    public dashboardId: string,
    public dashboardItem: any,
    public action: string,
    public skipStoreUpdate?: boolean
  ) {}
}

export class ManageDashboardItemSuccessAction implements Action {
  readonly type = DashboardActionTypes.ManageDashboardItemSuccess;
  constructor(public dashboardId: string, public dashboardItem: any) {}
}

export class ManageDashboardItemFailAction implements Action {
  readonly type = DashboardActionTypes.ManageDashboardItemFail;
  constructor(public dashboardId: string, public error: ErrorMessage) {}
}

export class AddNewUnsavedFavoriteAction implements Action {
  readonly type = DashboardActionTypes.AddNewUnsavedFavorite;
  constructor(public id: string) {}
}

export class GlobalFilterChangeAction implements Action {
  readonly type = DashboardActionTypes.GlobalFilterChange;
  constructor(public id: string, public changes: Partial<Dashboard>) {}
}

export class SaveDashboardAction implements Action {
  readonly type = DashboardActionTypes.SaveDashboard;
  constructor(public dashboard: Dashboard) {}
}

export class SaveDashboardSuccessAction implements Action {
  readonly type = DashboardActionTypes.SaveDashboardSuccess;
  constructor(public dashboard: Dashboard) {}
}

export class SaveDashboardFailAction implements Action {
  readonly type = DashboardActionTypes.SaveDashboardFail;
  constructor(public dashboard: Dashboard, public error: any) {}
}

export class ArchiveDashboardAction implements Action {
  readonly type = DashboardActionTypes.ArchiveDashboard;
  constructor(public dashboard: Dashboard) {}
}

export class ArchiveDashboardSuccessAction implements Action {
  readonly type = DashboardActionTypes.ArchiveDashboardSuccess;
  constructor(public dashboard: Dashboard) {}
}

export class ArchiveDashboardFailAction implements Action {
  readonly type = DashboardActionTypes.ArchiveDashboardFail;
  constructor(public dashboard: Dashboard, public error: any) {}
}
export class ResetDashboardAction implements Action {
  readonly type = DashboardActionTypes.ResetDashboard;
  constructor(public id: string, public changes: Partial<Dashboard>) {}
}

export class ChangeDashboardMenuHeight implements Action {
  readonly type = DashboardActionTypes.ChangeDashboardMenuHeight;
}
export type DashboardActions =
  | LoadDashboardsAction
  | ManageDashboardItemAction
  | ManageDashboardItemSuccessAction
  | ManageDashboardItemFailAction
  | LoadDashboardsFailAction
  | LoadDashboardsSuccessAction
  | CreateDashboardAction
  | AddDashboardAction
  | AddDashboardsAction
  | UpdateDashboardAction
  | SaveDashboardAction
  | SaveDashboardSuccessAction
  | SaveDashboardFailAction
  | ArchiveDashboardAction
  | ArchiveDashboardSuccessAction
  | ArchiveDashboardFailAction
  | DeleteDashboard
  | DeleteDashboardSuccess
  | DeleteDashboardFail
  | RemoveDashboard
  | ClearDashboards
  | SetCurrentDashboardAction
  | ToggleDashboardBookmarkAction
  | ToggleDashboardBookmarkSuccessAction
  | ToggleDashboardBookmarkFailAction
  | AddNewUnsavedFavoriteAction
  | SetCurrentVisualizationAction
  | GlobalFilterChangeAction
  | ResetDashboardAction
  | ChangeDashboardMenuHeight;
