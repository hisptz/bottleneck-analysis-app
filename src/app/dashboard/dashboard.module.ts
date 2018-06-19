import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { containers } from './containers/index';
import { StoreModule } from '@ngrx/store';
import * as fromDashboard from './reducers/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './effects/dashboard.effects';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    StoreModule.forFeature('dashboard', fromDashboard.reducer),
    EffectsModule.forFeature([DashboardEffects])
  ],
  declarations: [...containers]
})
export class DashboardModule { }
