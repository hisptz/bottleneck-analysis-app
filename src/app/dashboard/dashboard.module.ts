import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { FavoriteFilterModule } from './modules/favorite-filter/favorite-filter.module';
import { NgxDhis2VisualizationModule } from './modules/ngx-dhis2-visualization/ngx-dhis2-visualization.module';
import { NgxDhis2SelectionFiltersModule } from './modules/ngx-dhis2-data-selection-filter/ngx-dhis2-selection-filters.module';
import { directives } from './directives';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import * as fromInterventionReducer from './store/reducers/intervention.reducer';
import * as fromInterventionEffect from './store/effects/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    NgxDhis2VisualizationModule,
    NgxDhis2SelectionFiltersModule,
    TranslateModule.forChild(),
    SharingFilterModule,
    FavoriteFilterModule,
    StoreModule.forFeature('intervention', fromInterventionReducer.reducer),
    EffectsModule.forFeature(fromInterventionEffect.effects)
  ],
  declarations: [...containers, ...components, ...pipes, ...directives]
})
export class DashboardModule {}
