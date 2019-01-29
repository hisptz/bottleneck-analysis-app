import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CurrentDashboardComponent } from './current-dashboard/current-dashboard.component';
import { CurrentDashboardVisualizationComponent } from './current-dashboard-visualization/current-dashboard-visualization.component';

export const containers: any[] = [
  DashboardComponent,
  DashboardHomeComponent,
  CurrentDashboardComponent,
  CurrentDashboardVisualizationComponent
];

export * from './dashboard/dashboard.component';
export * from './dashboard-home/dashboard-home.component';
export * from './current-dashboard/current-dashboard.component';
export * from './current-dashboard-visualization/current-dashboard-visualization.component';
