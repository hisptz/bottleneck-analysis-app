import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragulaModule } from 'ng2-dragula';
import { HttpModule } from '@angular/http';
import { components } from './components';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ColorPickerModule } from 'ngx-color-picker';

import * as fromDataFilterReducer from './store/reducers/data-filter.reducer';
import * as fromFunctionReducer from './store/reducers/function.reducer';
import * as fromFunctionRuleReducer from './store/reducers/function-rule.reducer';
import * as fromIndicatorGroupReducer from './store/reducers/indicator-group.reducer';
import * as fromIndicatorReducer from './store/reducers/indicator.reducer';

import * as fromDataGroupEffects from './store/effects';

import { containers } from './containers';
import { pipes } from './pipes';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    DragulaModule,
    ColorPickerModule,
    NgxPaginationModule,
    SharedModule,
    StoreModule.forFeature('dataFilter', fromDataFilterReducer.reducer),
    StoreModule.forFeature('function', fromFunctionReducer.reducer),
    StoreModule.forFeature('functionRule', fromFunctionRuleReducer.reducer),
    StoreModule.forFeature('indicatorGroup', fromIndicatorGroupReducer.reducer),
    StoreModule.forFeature('indicator', fromIndicatorReducer.reducer),
    EffectsModule.forFeature(fromDataGroupEffects.effects)
  ],
  declarations: [...pipes, ...containers, ...components],
  exports: [...containers],
  providers: []
})
export class DataFilterModule {}
