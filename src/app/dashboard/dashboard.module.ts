import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { containers } from './containers';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './effects/dashboard.effects';
import { NgxDhis2VisualizationModule } from '@hisptz/ngx-dhis2-visualization';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxDhis2VisualizationModule.forRoot(),
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature([DashboardEffects])
  ],
  declarations: [...containers]
})
export class DashboardModule {}
