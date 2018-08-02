import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteFilterComponent } from './containers/favorite-filter/favorite-filter.component';
import { EffectsModule } from '@ngrx/effects';
import { FavoriteFilterEffects } from './store/effects/favorite-filter.effects';
import { StoreModule } from '@ngrx/store';
import { favoriteFilterReducer } from './store/reducers/favorite-filter.reducer';
import { TranslateModule } from '@ngx-translate/core';
import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('favoriteFilter', favoriteFilterReducer),
    EffectsModule.forFeature([FavoriteFilterEffects]),
    TranslateModule.forChild()
  ],
  declarations: [FavoriteFilterComponent, ...pipes],
  exports: [FavoriteFilterComponent]
})
export class FavoriteFilterModule {}
