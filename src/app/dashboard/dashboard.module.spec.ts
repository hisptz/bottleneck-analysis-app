import { DashboardModule } from './dashboard.module';
import { async, TestBed } from '@angular/core/testing';
import { containers } from './containers';
import { components } from './components';
import { pipes } from './pipes';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDhis2VisualizationModule } from './modules/ngx-dhis2-visualization/ngx-dhis2-visualization.module';
import { NgxDhis2SelectionFiltersModule } from './modules/ngx-dhis2-data-selection-filter/ngx-dhis2-selection-filters.module';
import { FavoriteFilterModule } from './modules/favorite-filter/favorite-filter.module';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { FormsModule } from '@angular/forms';

describe('DashboardModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DashboardRoutingModule,
        TranslateModule.forChild(),
        NgxDhis2VisualizationModule,
        NgxDhis2SelectionFiltersModule,
        FavoriteFilterModule,
        SharingFilterModule
      ],
      declarations: [...containers, ...components, ...pipes]
    }).compileComponents();
  }));

  let dashboardModule: DashboardModule;

  beforeEach(() => {
    dashboardModule = new DashboardModule();
  });

  // it('should create an instance', () => {
  //   expect(dashboardModule).toBeTruthy();
  // });
});
