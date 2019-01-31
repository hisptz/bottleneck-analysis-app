import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDashboardListComponent } from './default-dashboard-list.component';
import { InterventionFormComponent } from '../intervention-form/intervention-form.component';
import { FilterByNamePipe } from '../../pipes/filter-by-name.pipe';
import { effects } from 'src/app/store/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DefaultDashboardListComponent', () => {
  let component: DefaultDashboardListComponent;
  let fixture: ComponentFixture<DefaultDashboardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        DefaultDashboardListComponent,
        InterventionFormComponent,
        FilterByNamePipe
      ]
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
