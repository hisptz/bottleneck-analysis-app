import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxDhis2VisualizationModule } from '@hisptz/ngx-dhis2-visualization';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { containers } from './containers';
import { dashboardEffects, dashboardReducer } from './store';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxDhis2VisualizationModule.forRoot(),
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature(dashboardEffects)
  ],
  declarations: [...containers]
})
export class DashboardModule {}
