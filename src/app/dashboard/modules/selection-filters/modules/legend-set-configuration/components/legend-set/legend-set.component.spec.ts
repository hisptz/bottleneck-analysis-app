/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LegendSetComponent } from './legend-set.component';
import { LegendConfigurationComponent } from '../legend-configuration/legend-configuration.component';
import { LegendColorPickerComponent } from '../legend-color-picker/legend-color-picker.component';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

describe('LegendSetComponent', () => {
  let component: LegendSetComponent;
  let fixture: ComponentFixture<LegendSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ColorPickerModule],
      declarations: [
        LegendSetComponent,
        LegendConfigurationComponent,
        LegendColorPickerComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
