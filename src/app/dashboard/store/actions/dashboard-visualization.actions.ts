import { Action } from '@ngrx/store';
import { DashboardVisualization } from '../../models';
import { DashboardSettings } from '../../models/dashboard-settings.model';
import { VisualizationDataSelection } from '../../modules/ngx-dhis2-visualization/models';

export enum DashboardVisualizationActionTypes {
  LoadDashboardVisualizations = '[DashboardVisualization] Load dashboard visualizations',
  LoadDashboardVisualizationsSuccess = '[DashboardVisualization] Load dashboard visualizations success',
  LoadDashboardVisualizationsFail = '[DashboardVisualization] Load dashboard visualizations fail',
  AddDashboardVisualizations = '[DashboardVisualization] Add dashboard visualizations',
  UpsertDashboardVisualization = '[DashboardVisualization] Add or Update dashboard visualization',
  AddDashboardVisualizationItem = '[DashboardVisualization] Add dashboard visualization item',
  RemoveDashboardVisualizationItem = '[DashboardVisualization] Remove dashboard visualization item',
  LoadDashboardVisualizationSuccess = '[DashboardVisualization] Load dashboard visualization success'
}

export class LoadDashboardVisualizationsAction implements Action {
  readonly type = DashboardVisualizationActionTypes.LoadDashboardVisualizations;
  constructor(
    public dashboardId: string,
    public currentVisualizationId: string,
    public dataSelections?: VisualizationDataSelection[]
  ) {}
}

export class LoadDashboardVisualizationsSuccessAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.LoadDashboardVisualizationsSuccess;
  constructor(
    public dashboardId: string,
    public dashboardItems: any[],
    public currentVisualizationId: string,
    public dataSelections?: VisualizationDataSelection[]
  ) {}
}

export class LoadDashboardVisualizationsFailAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.LoadDashboardVisualizationsFail;
  constructor(public dashboardId: string, public error: any) {}
}
export class AddDashboardVisualizationsAction implements Action {
  readonly type = DashboardVisualizationActionTypes.AddDashboardVisualizations;
  constructor(public dashboardVisualizations: DashboardVisualization[]) {}
}

export class AddDashboardVisualizationAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.UpsertDashboardVisualization;
  constructor(public dashboardVisualization: DashboardVisualization) {}
}

export class AddDashboardVisualizationItemAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.AddDashboardVisualizationItem;
  constructor(public dashboardId: string, public dashboardItemId: string) {}
}

export class RemoveDashboardVisualizationItemAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.RemoveDashboardVisualizationItem;
  constructor(public dashboardId: string, public dashboardItemId: string) {}
}

export class LoadDashboardVisualizationSuccessAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.LoadDashboardVisualizationSuccess;
}

export type DashboardVisualizationAction =
  | LoadDashboardVisualizationsAction
  | LoadDashboardVisualizationsFailAction
  | AddDashboardVisualizationsAction
  | AddDashboardVisualizationAction
  | AddDashboardVisualizationItemAction
  | RemoveDashboardVisualizationItemAction
  | LoadDashboardVisualizationSuccessAction;
