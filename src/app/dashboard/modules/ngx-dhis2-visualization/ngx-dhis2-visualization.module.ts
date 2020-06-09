import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDhis2DictionaryModule } from '../ngx-dhis2-dictionary/ngx-dhis2-dictionary.module';
import { SelectionFiltersModule } from '../selection-filters/selection-filters.module';
import { components } from './components';
import { containers } from './containers';
import { MapModule } from './modules/map/map.module';
import { NgxDhis2ChartModule } from './modules/ngx-dhis-chart/ngx-dhis2-chart.module';
import { NgxDhis2TableModule } from './modules/ngx-dhis2-table/ngx-dhis2-table.module';
import { effects } from './store/effects';
import { reducers } from './store/reducers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule.forRoot(),
    StoreModule.forFeature('visualization', reducers),
    EffectsModule.forFeature(effects),
    NgxDhis2ChartModule,
    NgxDhis2TableModule,
    SelectionFiltersModule,
    NgxDhis2DictionaryModule,
    MapModule,
  ],
  declarations: [...components, ...containers],
  exports: [...containers],
})
export class NgxDhis2VisualizationModule {}
