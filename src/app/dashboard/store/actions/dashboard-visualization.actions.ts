import { Action } from '@ngrx/store';
import { DashboardVisualization } from '../../models';

export enum DashboardVisualizationActionTypes {
  AddDashboardVisualizations = '[DashboardVisualization] Add dashboard visualizations',
  AddDashboardVisualizationItem = '[DashboardVisualization] Add dashboard visualization item'
}

export class AddDashboardVisualizationsAction implements Action {
  readonly type = DashboardVisualizationActionTypes.AddDashboardVisualizations;
  constructor(public dashboardVisualizations: DashboardVisualization[]) {}
}

export class AddDashboardVisualizationItemAction implements Action {
  readonly type =
    DashboardVisualizationActionTypes.AddDashboardVisualizationItem;
  constructor(public dashboardId: string, public dashboardItemId: string) {}
}

export type DashboardVisualizationAction =
  | AddDashboardVisualizationsAction
  | AddDashboardVisualizationItemAction;
