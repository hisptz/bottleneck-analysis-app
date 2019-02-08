import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import {
  MapLoaderComponent,
  ContainerMapComponent,
  MapVisualizerComponent,
  MapFilterSectionComponent,
  MapStyleComponent
} from '../../components';
import { VisualizationLegendComponent } from '../visualization-legend/visualization-legend.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxPaginationModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        MapComponent,
        MapLoaderComponent,
        ContainerMapComponent,
        MapVisualizerComponent,
        VisualizationLegendComponent,
        DataTableComponent,
        MapFilterSectionComponent,
        MapStyleComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
