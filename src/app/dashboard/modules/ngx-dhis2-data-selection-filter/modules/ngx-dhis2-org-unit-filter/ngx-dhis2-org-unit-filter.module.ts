import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { containers } from './containers';
import { components } from './components';
import { orgUnitFilterReducer } from './store/reducers';
import { orgUnitFilterEffects } from './store/effects';
import { CommonModule } from '@angular/common';
import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('orgUnitFilter', orgUnitFilterReducer),
    EffectsModule.forFeature(orgUnitFilterEffects)
  ],
  declarations: [...containers, ...components, ...pipes],
  exports: [...containers]
})
export class NgxDhis2OrgUnitFilterModule {}
