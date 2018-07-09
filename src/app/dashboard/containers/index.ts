import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CurrentDashboardComponent } from './current-dashboard/current-dashboard.component';

export const containers: any[] = [
  DashboardComponent,
  DashboardHomeComponent,
  CurrentDashboardComponent
];

export * from './dashboard/dashboard.component';
export * from './dashboard-home/dashboard-home.component';
export * from './current-dashboard/current-dashboard.component';
