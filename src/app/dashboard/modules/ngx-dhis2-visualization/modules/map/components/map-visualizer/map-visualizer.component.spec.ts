import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapVisualizerComponent } from './map-visualizer.component';
import { VisualizationLegendComponent } from '../../containers';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapFilterSectionComponent } from '../map-filter-section/map-filter-section.component';
import { NgxDhis2PeriodFilterModule } from '@iapps/ngx-dhis2-period-filter';
import { MapStyleComponent } from '../map-style/map-style.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { NgxDhis2OrgUnitFilterModule } from 'src/app/ngx-dhis2-org-unit-filter/ngx-dhis2-org-unit-filter.module';

describe('MapVisualizerComponent', () => {
  let component: MapVisualizerComponent;
  let fixture: ComponentFixture<MapVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxPaginationModule,
        NgxDhis2OrgUnitFilterModule,
        NgxDhis2PeriodFilterModule,
        ColorPickerModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      declarations: [
        MapVisualizerComponent,
        VisualizationLegendComponent,
        MapFilterSectionComponent,
        MapStyleComponent,
      ],
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
