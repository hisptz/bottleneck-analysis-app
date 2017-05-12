import { NgModule }     from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";

export const routes: Routes = [
  { path: 'dashboards/:id', component: DashboardComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
