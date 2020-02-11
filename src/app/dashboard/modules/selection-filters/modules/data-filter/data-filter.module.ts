import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';

import { components } from './components';
import { containers } from './containers';
import { pipes } from './pipes';
import * as fromDataGroupEffects from './store/effects';
import * as fromDataFilterReducer from './store/reducers/data-filter.reducer';
import * as fromFunctionRuleReducer from './store/reducers/function-rule.reducer';
import * as fromFunctionReducer from './store/reducers/function.reducer';
import * as fromIndicatorGroupReducer from './store/reducers/indicator-group.reducer';
import * as fromIndicatorReducer from './store/reducers/indicator.reducer';
import { SharingFilterModule } from '../../../sharing-filter/sharing-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DragulaModule,
    ColorPickerModule,
    NgxPaginationModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    SharingFilterModule,
    SharedModule,
    StoreModule.forFeature('dataFilter', fromDataFilterReducer.reducer),
    StoreModule.forFeature('function', fromFunctionReducer.reducer),
    StoreModule.forFeature('functionRule', fromFunctionRuleReducer.reducer),
    StoreModule.forFeature('indicatorGroup', fromIndicatorGroupReducer.reducer),
    StoreModule.forFeature('indicator', fromIndicatorReducer.reducer),
    EffectsModule.forFeature(fromDataGroupEffects.effects),
  ],
  declarations: [...pipes, ...containers, ...components],
  exports: [...containers],
  providers: [],
})
export class DataFilterModule {}
