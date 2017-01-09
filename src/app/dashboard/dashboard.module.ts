import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRouteModule} from "./dashboard.routing.module";
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import {SharedModule} from "../shared/shared-module.module";

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      DashboardRouteModule
  ],
  declarations: [DashboardComponent, DashboardMenuComponent]
})
export class DashboardModule { }
