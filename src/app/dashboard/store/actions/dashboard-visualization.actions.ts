import { Action } from '@ngrx/store';
import { DashboardVisualization } from '../../models';

export enum DashboardVisualizationActionTypes {
  AddDashboardVisualizations = '[DashboardVisualization] Add dashboard visualizations'
}

export class AddDashboardVisualizationsAction implements Action {
  readonly type = DashboardVisualizationActionTypes.AddDashboardVisualizations;
  constructor(public dashboardVisualizations: DashboardVisualization[]) {}
}

export type DashboardVisualizationAction = AddDashboardVisualizationsAction;
