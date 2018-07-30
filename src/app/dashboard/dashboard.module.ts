import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { NgxDhis2VisualizationModule } from '@hisptz/ngx-dhis2-visualization';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { FavoriteFilterModule } from './modules/favorite-filter/favorite-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    NgxDhis2VisualizationModule,
    TranslateModule.forChild(),
    SharingFilterModule,
    FavoriteFilterModule
  ],
  declarations: [...containers, ...components, ...pipes]
})
export class DashboardModule {}
