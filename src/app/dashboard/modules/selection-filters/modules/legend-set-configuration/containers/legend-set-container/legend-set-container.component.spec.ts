/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LegendSetContainerComponent } from './legend-set-container.component';
import { LegendSetComponent } from '../../components/legend-set/legend-set.component';
import { LegendConfigurationComponent } from '../../components/legend-configuration/legend-configuration.component';
import { LegendColorPickerComponent } from '../../../data-filter/components/legend-color-picker/legend-color-picker.component';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

describe('LegendSetContainerComponent', () => {
  let component: LegendSetContainerComponent;
  let fixture: ComponentFixture<LegendSetContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ColorPickerModule],
      declarations: [
        LegendSetContainerComponent,
        LegendSetComponent,
        LegendConfigurationComponent,
        LegendColorPickerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendSetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
