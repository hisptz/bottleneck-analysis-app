import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRouteModule} from "./dashboard.routing.module";
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import {SharedModule} from "../shared/shared-module.module";
import { DashboardItemComponent } from './components/dashboard-item/dashboard-item.component';
import { DashboardItemSearchComponent } from './components/dashboard-item-search/dashboard-item-search.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      DashboardRouteModule
  ],
  declarations: [DashboardComponent, DashboardMenuComponent, DashboardItemComponent, DashboardItemSearchComponent],
  providers: []
})
export class DashboardModule { }
