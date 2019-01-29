import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { NgxDhis2TableModule } from './modules/ngx-dhis2-table/ngx-dhis2-table.module';
import { NgxDhis2DictionaryModule } from '@hisptz/ngx-dhis2-dictionary';
import { NgxDhis2SelectionFiltersModule } from '../ngx-dhis2-data-selection-filter/ngx-dhis2-selection-filters.module';
import { NgxDhis2ChartModule } from './modules/ngx-dhis-chart/ngx-dhis2-chart.module';
import { MapModule } from './modules/map/map.module';

import { reducers } from './store/reducers';
import { pipes } from './pipes';
import { components } from './components';
import { containers } from './containers';
import { effects } from './store/effects';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forRoot(),
    StoreModule.forFeature('visualization', reducers),
    EffectsModule.forFeature(effects),
    NgxDhis2ChartModule,
    NgxDhis2TableModule,
    NgxDhis2DictionaryModule,
    NgxDhis2SelectionFiltersModule,
    MapModule
  ],
  declarations: [...pipes, ...components, ...containers],
  exports: [...containers]
})
export class NgxDhis2VisualizationModule {}
