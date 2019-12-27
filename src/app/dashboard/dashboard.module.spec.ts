import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { components } from './components';
import { containers } from './containers';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardModule } from './dashboard.module';
import { NgxDhis2VisualizationModule } from './modules/ngx-dhis2-visualization/ngx-dhis2-visualization.module';
import { SelectionFiltersModule } from './modules/selection-filters/selection-filters.module';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { pipes } from './pipes';

describe('DashboardModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DashboardRoutingModule,
        TranslateModule.forChild(),
        NgxDhis2VisualizationModule,
        SelectionFiltersModule,
        SharingFilterModule,
      ],
      declarations: [...containers, ...components, ...pipes],
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
