import { StoreModule } from '@ngrx/store';

import * as fromInterventionReducer from './intervention.reducer';
import * as fromDashboardReducer from './dashboard.reducer';
import * as fromDashboardVisualizationReducer from './dashboard-visualization.reducer';
import * as fromDashboardSettingsReducer from './dashboard-settings.reducer';
import * as fromDashboardGroupReducer from './dashboard-groups.reducer';

export const reducers: any[] = [
  StoreModule.forFeature('intervention', fromInterventionReducer.reducer),
  StoreModule.forFeature('dashboard', fromDashboardReducer.reducer),
  StoreModule.forFeature(
    'dashboardVisualization',
    fromDashboardVisualizationReducer.reducer
  ),
  StoreModule.forFeature(
    'dashboardSettings',
    fromDashboardSettingsReducer.reducer
  ),
  StoreModule.forFeature('dashboardGroup', fromDashboardGroupReducer.reducer)
];
