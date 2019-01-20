import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DashboardComponent,
  DashboardHomeComponent,
  CurrentDashboardComponent,
  CurrentDashboardVisualizationComponent
} from './containers';
import { UnSavedDashboardGuard } from './guards/un-saved-dashboard.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardHomeComponent
      },
      {
        path: ':id/fullScreen/:visualizationId',
        component: CurrentDashboardVisualizationComponent
      },
      {
        path: ':id',
        canDeactivate: [UnSavedDashboardGuard],
        component: CurrentDashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
