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

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    StoreModule.forFeature('map', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...containers, ...components],
  exports: [...containers, ...components]
})
export class MapModule {}
