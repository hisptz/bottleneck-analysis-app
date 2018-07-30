import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  DashboardVisualizationAction,
  DashboardVisualizationActionTypes
} from '../actions';
import { DashboardVisualization } from '../../dashboard/models';

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
    case DashboardVisualizationActionTypes.AddDashboardVisualizationItem: {
      return dashboardVisualizationAdapter.updateOne(
        {
          id: action.dashboardId,
          changes: {
            items: [
              action.dashboardItemId,
              ...(state.entities[action.dashboardId]
                ? state.entities[action.dashboardId].items
                : [])
            ]
          }
        },
        state
      );
    }
  }
  return state;
}

export const {
  selectEntities: getDashboardVisualizationEntitiesState
} = dashboardVisualizationAdapter.getSelectors();
