import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerMapComponent } from './container-map.component';
import { MapVisualizerComponent } from '../map-visualizer/map-visualizer.component';
import {
  VisualizationLegendComponent,
  DataTableComponent
} from '../../containers';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapFilterSectionComponent } from '../map-filter-section/map-filter-section.component';
import { MapStyleComponent } from '../map-style/map-style.component';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
describe('ContainerMapComponent', () => {
  let component: ContainerMapComponent;
  let fixture: ComponentFixture<ContainerMapComponent>;

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
    fixture = TestBed.createComponent(ContainerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
