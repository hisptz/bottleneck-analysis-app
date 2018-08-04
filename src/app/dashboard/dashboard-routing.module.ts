import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DashboardComponent,
  DashboardHomeComponent,
  CurrentDashboardComponent,
  CurrentDashboardVisualizationComponent
} from './containers';

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
