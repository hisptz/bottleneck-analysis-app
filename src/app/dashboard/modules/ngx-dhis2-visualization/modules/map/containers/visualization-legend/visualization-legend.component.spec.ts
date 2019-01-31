import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationLegendComponent } from './visualization-legend.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapFilterSectionComponent, MapStyleComponent } from '../../components';
import {
  OrgUnitFilterModule,
  DataFilterModule,
  PeriodFilterModule
} from '../../modules';

import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('VisualizationLegendComponent', () => {
  let component: VisualizationLegendComponent;
  let fixture: ComponentFixture<VisualizationLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxPaginationModule,
        OrgUnitFilterModule,
        DataFilterModule,
        PeriodFilterModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        VisualizationLegendComponent,
        MapFilterSectionComponent,
        MapStyleComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
