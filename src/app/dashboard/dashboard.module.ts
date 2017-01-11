import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRouteModule} from "./dashboard.routing.module";
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import {SharedModule} from "../shared/shared-module.module";
import { DashboardItemComponent } from './components/dashboard-item-card/dashboard-item-card.component';
import { DashboardItemSearchComponent } from './components/dashboard-item-search/dashboard-item-search.component';
import {DashboardSettingsService} from "./providers/dashboard-settings.service";
import { DashboardShareComponent } from './components/dashboard-share/dashboard-share.component';
import { DashboardDimensionsComponent } from './components/dashboard-dimensions/dashboard-dimensions.component';
import { DashboardPeriodSettingsComponent } from './components/dashboard-period-settings/dashboard-period-settings.component';
import { DashboardOrgunitSettingsComponent } from './components/dashboard-orgunit-settings/dashboard-orgunit-settings.component';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      DashboardRouteModule
  ],
  declarations: [DashboardComponent, DashboardMenuComponent, DashboardItemComponent, DashboardItemSearchComponent, DashboardShareComponent, DashboardDimensionsComponent, DashboardPeriodSettingsComponent, DashboardOrgunitSettingsComponent],
  providers: [DashboardSettingsService]
})
export class DashboardModule { }
