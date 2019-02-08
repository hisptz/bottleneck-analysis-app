import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DashboardProgressComponent } from '../../components/dashboard-progress/dashboard-progress.component';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { DashboardMenuComponent } from '../../components/dashboard-menu/dashboard-menu.component';
import { DefaultDashboardListComponent } from '../../components/default-dashboard-list/default-dashboard-list.component';
import { SortByBookmarkPipe } from '../../pipes/sort-by-bookmark.pipe';
import { FilterByNamePipe } from '../../../shared/pipes/filter-by-name.pipe';
import { DashboardMenuItemComponent } from '../../components/dashboard-menu-item/dashboard-menu-item.component';
import { InterventionFormComponent } from '../../components/intervention-form/intervention-form.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        DashboardComponent,
        DashboardProgressComponent,
        DashboardMenuComponent,
        DashboardMenuItemComponent,
        DefaultDashboardListComponent,
        InterventionFormComponent,
        SortByBookmarkPipe,
        FilterByNamePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
