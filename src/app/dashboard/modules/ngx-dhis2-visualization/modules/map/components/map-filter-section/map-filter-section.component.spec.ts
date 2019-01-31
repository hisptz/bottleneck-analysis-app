import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFilterSectionComponent } from './map-filter-section.component';
import {
  OrgUnitFilterModule,
  PeriodFilterModule,
  DataFilterModule
} from '../../modules';
import { MapStyleComponent } from '../map-style/map-style.component';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from 'src/app/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('MapFilterSectionComponent', () => {
  let component: MapFilterSectionComponent;
  let fixture: ComponentFixture<MapFilterSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrgUnitFilterModule,
        PeriodFilterModule,
        DataFilterModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [MapFilterSectionComponent, MapStyleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFilterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
