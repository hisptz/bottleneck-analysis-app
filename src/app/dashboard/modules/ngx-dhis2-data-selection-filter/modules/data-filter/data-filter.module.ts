import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterComponent } from './data-filter.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { FormsModule } from '@angular/forms';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { OrderPipe } from './pipes/order-by.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddUnderscorePipe } from './pipes/add-underscore.pipe';
import { DragulaModule } from 'ng2-dragula';
import { DndModule } from 'ng2-dnd';
import { DataFilterService } from './services/data-filter.service';
import { HttpModule } from '@angular/http';
import { components } from './components';
import { StoreModule } from '@ngrx/store';

import * as fromDataGroupReducer from './store/reducers/data-group.reducer';
import * as fromDataGroupEffects from './store/effects/index';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    DragulaModule,
    NgxPaginationModule,
    DndModule.forRoot(),
    StoreModule.forFeature('dataGroup', fromDataGroupReducer.reducer),
    EffectsModule.forFeature(fromDataGroupEffects.effects)
  ],
  declarations: [
    DataFilterComponent,
    ClickOutsideDirective,
    FilterByNamePipe,
    OrderPipe,
    AddUnderscorePipe,
    ...components
  ],
  exports: [DataFilterComponent],
  providers: [DataFilterService]
})
export class DataFilterModule {}
