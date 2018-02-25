import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
// containers
import * as fromContainers from './containers';
// components
import * as fromComponents from './components';

import * as fromServices from './services';

import { DragulaModule } from 'ng2-dragula';

import { NgxPaginationModule } from 'ngx-pagination';

import { VirtualScrollModule } from 'angular2-virtual-scroll';

// Filters Modules
import { OrgUnitFilterModule } from '../org-unit-filter/org-unit-filter.module';
import { PeriodFilterModule } from '../period-filter/period-filter.module';
import { DataFilterModule } from '../data-filter/data-filter.module';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule,
    NgxPaginationModule,
    OrgUnitFilterModule,
    PeriodFilterModule,
    DataFilterModule,
    VirtualScrollModule,
    StoreModule.forFeature('map', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  exports: [...fromContainers.containers, ...fromComponents.components]
})
export class MapModule {}
