import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDhis2VisualizationModule } from '@hisptz/ngx-dhis2-visualization';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { dashboardEffects, dashboardReducer } from './store';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxDhis2VisualizationModule,
    TranslateModule.forChild(),
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature(dashboardEffects),
    SharingFilterModule
  ],
  declarations: [...containers, ...components, ...pipes]
})
export class DashboardModule {}
