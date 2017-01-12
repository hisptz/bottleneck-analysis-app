import { NgModule }     from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: '', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
