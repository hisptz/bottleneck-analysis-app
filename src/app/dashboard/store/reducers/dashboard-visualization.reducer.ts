import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  DashboardVisualizationAction,
  DashboardVisualizationActionTypes
} from '../actions';
import { DashboardVisualization } from '../../models';

export interface DashboardVisualizationState
  extends EntityState<DashboardVisualization> {}

export const dashboardVisualizationAdapter: EntityAdapter<
  DashboardVisualization
> = createEntityAdapter<DashboardVisualization>();

const initialState: DashboardVisualizationState = dashboardVisualizationAdapter.getInitialState(
  {}
);

export function dashboardVisualizationReducer(
  state: DashboardVisualizationState = initialState,
  action: DashboardVisualizationAction
): DashboardVisualizationState {
  switch (action.type) {
    case DashboardVisualizationActionTypes.AddDashboardVisualizations:
      return dashboardVisualizationAdapter.addAll(
        action.dashboardVisualizations,
        state
      );
  }
  return state;
}
