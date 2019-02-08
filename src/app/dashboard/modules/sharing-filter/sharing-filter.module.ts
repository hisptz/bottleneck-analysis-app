import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';

import { sharingFilterReducer } from './store/reducers/sharing-filter.reducer';
import { SharingFilterComponent } from './containers/sharing-filter/sharing-filter.component';
import { SharingFilterEffects } from './store/effects/sharing-filter.effects';

import { LimitPipe } from './pipes/limit.pipe';
import { sharingSearchListReducer } from './store/reducers/sharing-search-list.reducer';
import { SharingSearchListEffects } from './store/effects/sharing-search-list.effects';
import { sharingItemReducer } from './store/reducers/sharing-item.reducer';
import { SharingItemEffects } from './store/effects/sharing-item.effects';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    StoreModule.forFeature('sharingFilter', sharingFilterReducer),
    StoreModule.forFeature('sharingSearchList', sharingSearchListReducer),
    StoreModule.forFeature('sharingItem', sharingItemReducer),
    EffectsModule.forFeature([
      SharingFilterEffects,
      SharingSearchListEffects,
      SharingItemEffects
    ]),
    TranslateModule.forChild()
  ],
  declarations: [SharingFilterComponent, LimitPipe],
  exports: [SharingFilterComponent]
})
export class SharingFilterModule {}
