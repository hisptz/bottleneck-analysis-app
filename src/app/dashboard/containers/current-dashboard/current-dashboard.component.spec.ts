import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDashboardComponent } from './current-dashboard.component';

import { effects } from 'src/app/store/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CurrentDashboardHeaderComponent } from '../../components/current-dashboard-header/current-dashboard-header.component';
import { DashboardProgressComponent } from '../../components/dashboard-progress/dashboard-progress.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { NgxDhis2VisualizationModule } from '../../modules/ngx-dhis2-visualization/ngx-dhis2-visualization.module';
import { CurrentDashboardTitleComponent } from '../../components/current-dashboard-title/current-dashboard-title.component';
import { CurrentDashboardSharingComponent } from '../../components/current-dashboard-sharing/current-dashboard-sharing.component';
import { CurrentDashboardBookmarkComponent } from '../../components/current-dashboard-bookmark/current-dashboard-bookmark.component';
import { NgxDhis2SelectionFiltersModule } from '../../modules/ngx-dhis2-data-selection-filter/ngx-dhis2-selection-filters.module';
import { FavoriteFilterModule } from '../../modules/favorite-filter/favorite-filter.module';
import { CurrentDashboardDescriptionComponent } from '../../components/current-dashboard-description/current-dashboard-description.component';
import { SharingFilterModule } from '../../modules/sharing-filter/sharing-filter.module';

describe('CurrentDashboardComponent', () => {
  let component: CurrentDashboardComponent;
  let fixture: ComponentFixture<CurrentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule,
        NgxDhis2VisualizationModule,
        NgxDhis2SelectionFiltersModule,
        FavoriteFilterModule,
        SharingFilterModule
      ],
      declarations: [
        CurrentDashboardComponent,
        CurrentDashboardHeaderComponent,
        DashboardProgressComponent,
        CurrentDashboardTitleComponent,
        CurrentDashboardSharingComponent,
        CurrentDashboardBookmarkComponent,
        CurrentDashboardDescriptionComponent,
        DashboardProgressComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
