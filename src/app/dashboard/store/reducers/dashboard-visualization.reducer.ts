import { createFeatureSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  DashboardVisualizationAction,
  DashboardVisualizationActionTypes
} from '../actions/dashboard-visualization.actions';
import { DashboardVisualization } from '../../models';

export interface State extends EntityState<DashboardVisualization> {
  visualizationsReady: boolean;
}

export const dashboardVisualizationAdapter: EntityAdapter<
  DashboardVisualization
> = createEntityAdapter<DashboardVisualization>();

const initialState: State = dashboardVisualizationAdapter.getInitialState({
  visualizationsReady: false
});

export function reducer(
  state: State = initialState,
  action: DashboardVisualizationAction
): State {
  switch (action.type) {
    case DashboardVisualizationActionTypes.AddDashboardVisualizations:
      return dashboardVisualizationAdapter.addAll(
        action.dashboardVisualizations,
        state
      );

    case DashboardVisualizationActionTypes.UpsertDashboardVisualization:
      return dashboardVisualizationAdapter.upsertOne(
        action.dashboardVisualization,
        state
      );
    case DashboardVisualizationActionTypes.AddDashboardVisualizationItem: {
      return dashboardVisualizationAdapter.updateOne(
        {
          id: action.dashboardId,
          changes: {
            items: [
              { id: action.dashboardItemId, width: 'span 4', height: '450px' },
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
        item => item.id !== action.dashboardItemId
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

export const getDashboardVisualizationState = createFeatureSelector<State>(
  'dashboardVisualization'
);

export const {
  selectEntities: getDashboardVisualizationEntities
} = dashboardVisualizationAdapter.getSelectors(getDashboardVisualizationState);
