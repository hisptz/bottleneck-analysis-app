import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './pages/home/home.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {FullScreenDashboardItemViewComponent} from './pages/full-screen-dashboard-item-view/full-screen-dashboard-item-view.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboards/:id',
    component: DashboardComponent,
    children: [{
      path: 'item/:id',
      component: FullScreenDashboardItemViewComponent
    }]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
