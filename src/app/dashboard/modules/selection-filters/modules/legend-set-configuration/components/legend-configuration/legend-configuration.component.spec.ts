/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LegendConfigurationComponent } from './legend-configuration.component';
import { LegendColorPickerComponent } from '../legend-color-picker/legend-color-picker.component';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

describe('LegendConfigurationComponent', () => {
  let component: LegendConfigurationComponent;
  let fixture: ComponentFixture<LegendConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ColorPickerModule],
      declarations: [LegendConfigurationComponent, LegendColorPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
