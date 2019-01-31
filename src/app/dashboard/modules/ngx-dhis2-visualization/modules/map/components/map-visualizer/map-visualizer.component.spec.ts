import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapVisualizerComponent } from './map-visualizer.component';
import {
  VisualizationLegendComponent,
  DataTableComponent
} from '../../containers';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapFilterSectionComponent } from '../map-filter-section/map-filter-section.component';
import {
  OrgUnitFilterModule,
  DataFilterModule,
  PeriodFilterModule
} from '../../modules';
import { MapStyleComponent } from '../map-style/map-style.component';

import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('MapVisualizerComponent', () => {
  let component: MapVisualizerComponent;
  let fixture: ComponentFixture<MapVisualizerComponent>;

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
        MapVisualizerComponent,
        VisualizationLegendComponent,
        DataTableComponent,
        MapFilterSectionComponent,
        MapStyleComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
