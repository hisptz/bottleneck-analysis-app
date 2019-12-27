import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDashboardListComponent } from './default-dashboard-list.component';
import { InterventionFormComponent } from '../intervention-form/intervention-form.component';
import { FilterByNamePipe } from '../../../shared/pipes/filter-by-name.pipe';
import { effects } from 'src/app/store/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('DefaultDashboardListComponent', () => {
  let component: DefaultDashboardListComponent;
  let fixture: ComponentFixture<DefaultDashboardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule,
        SharedModule,
        FormsModule,
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      declarations: [DefaultDashboardListComponent, InterventionFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
