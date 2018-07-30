import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDhis2VisualizationModule } from '@hisptz/ngx-dhis2-visualization';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { dashboardEffects } from './store';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { FavoriteFilterModule } from './modules/favorite-filter/favorite-filter.module';
import { dashboardObjectReducer } from './store/reducers/dashboard.reducer';
import { dashboardSettingsReducer } from './store/reducers/dashboard-settings.reducer';
import { dashboardVisualizationReducer } from './store/reducers/dashboard-visualization.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    NgxDhis2VisualizationModule,
    TranslateModule.forChild(),
    StoreModule.forFeature('dashboardObject', dashboardObjectReducer),
    StoreModule.forFeature('dashboardSettings', dashboardSettingsReducer),
    StoreModule.forFeature(
      'dashboardVisualization',
      dashboardVisualizationReducer
    ),
    EffectsModule.forFeature(dashboardEffects),
    SharingFilterModule,
    FavoriteFilterModule
  ],
  declarations: [...containers, ...components, ...pipes]
})
export class DashboardModule {}
