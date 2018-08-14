import { Action } from '@ngrx/store';
import { DashboardVisualization } from '../../dashboard/models';

export enum DashboardVisualizationActionTypes {
  AddDashboardVisualizations = '[DashboardVisualization] Add dashboard visualizations',
  AddDashboardVisualization = '[DashboardVisualization] Add dashboard visualization',
  AddDashboardVisualizationItem = '[DashboardVisualization] Add dashboard visualization item',
  RemoveDashboardVisualizationItem = '[DashboardVisualization] Remove dashboard visualization item'
}

export class AddDashboardVisualizationsAction implements Action {
  readonly type = DashboardVisualizationActionTypes.AddDashboardVisualizations;
  constructor(public dashboardVisualizations: DashboardVisualization[]) {}
}

export class AddDashboardVisualizationAction implements Action {
  readonly type = DashboardVisualizationActionTypes.AddDashboardVisualization;
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

export type DashboardVisualizationAction =
  | AddDashboardVisualizationsAction
  | AddDashboardVisualizationAction
  | AddDashboardVisualizationItemAction
  | RemoveDashboardVisualizationItemAction;
