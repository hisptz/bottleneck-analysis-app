import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
// containers
import { containers } from './containers';
// components
import { components } from './components';

import { NgxPaginationModule } from 'ngx-pagination';

// Filters Modules
import { modules } from './modules';

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
