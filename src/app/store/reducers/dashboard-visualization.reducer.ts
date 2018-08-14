import { createFeatureSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  DashboardVisualizationAction,
  DashboardVisualizationActionTypes
} from '../actions';
import { DashboardVisualization } from '../../dashboard/models';

export interface DashboardVisualizationState
  extends EntityState<DashboardVisualization> {
  visualizationsReady: boolean;
}

export const dashboardVisualizationAdapter: EntityAdapter<
  DashboardVisualization
> = createEntityAdapter<DashboardVisualization>();

const initialState: DashboardVisualizationState = dashboardVisualizationAdapter.getInitialState(
  {
    visualizationsReady: false
  }
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

    case DashboardVisualizationActionTypes.AddDashboardVisualization:
      return dashboardVisualizationAdapter.addOne(
        action.dashboardVisualization,
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

    case DashboardVisualizationActionTypes.LoadDashboardVisualizationSuccess: {
      return { ...state, visualizationsReady: true };
    }

    case DashboardVisualizationActionTypes.RemoveDashboardVisualizationItem: {
      const correspondingDashboard = state.entities[action.dashboardId];
      const items = _.filter(
        correspondingDashboard ? correspondingDashboard.items : [],
        item => item !== action.dashboardItemId
      );

      return dashboardVisualizationAdapter.updateOne(
        {
          id: action.dashboardId,
          changes: { items }
        },
        state
      );
    }
  }
  return state;
}

export const getVisualizationsReadyState = (
  state: DashboardVisualizationState
) => state.visualizationsReady;

export const {
  selectEntities: getDashboardVisualizationEntitiesState
} = dashboardVisualizationAdapter.getSelectors();
