import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRouteModule} from "./dashboard.routing.module";
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import {SharedModule} from "../shared/shared-module.module";
import { DashboardItemCardComponent } from './components/dashboard-item-card/dashboard-item-card.component';
import { DashboardItemSearchComponent } from './components/dashboard-item-search/dashboard-item-search.component';
import {DashboardSettingsService} from "./providers/dashboard-settings.service";
import { DashboardShareComponent } from './components/dashboard-share/dashboard-share.component';
import { DashboardDimensionsComponent } from './components/dashboard-dimensions/dashboard-dimensions.component';
import { DashboardPeriodSettingsComponent } from './components/dashboard-period-settings/dashboard-period-settings.component';
import { DashboardOrgunitSettingsComponent } from './components/dashboard-orgunit-settings/dashboard-orgunit-settings.component';
import {DashboardService} from "./providers/dashboard.service";
import { DashboardItemsComponent } from './pages/dashboard-items/dashboard-items.component';
import { DashboardLandingComponent } from './pages/dashboard-landing/dashboard-landing.component';
import { DashboardMenuItemsComponent } from './components/dashboard-menu-items/dashboard-menu-items.component';
import { DashboardMenuPaginationComponent } from './components/dashboard-menu-pagination/dashboard-menu-pagination.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      SharedModule,
      DashboardRouteModule
  ],
  declarations: [DashboardComponent, DashboardMenuComponent, DashboardItemCardComponent, DashboardItemSearchComponent, DashboardShareComponent, DashboardDimensionsComponent, DashboardPeriodSettingsComponent, DashboardOrgunitSettingsComponent, DashboardItemsComponent, DashboardLandingComponent, DashboardMenuItemsComponent, DashboardMenuPaginationComponent, CreateDashboardComponent],
  providers: [
      DashboardSettingsService,
      DashboardService
  ]
})
export class DashboardModule { }
