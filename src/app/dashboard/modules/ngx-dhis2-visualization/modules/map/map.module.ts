import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store/index';
// containers
import { containers } from './containers/index';
// components
import { components } from './components/index';

import { NgxPaginationModule } from 'ngx-pagination';

// Filters Modules
import { modules } from './modules/index';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    ...modules,
    StoreModule.forFeature('map', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...containers, ...components],
  exports: [...containers, ...components]
})
export class MapModule {}
