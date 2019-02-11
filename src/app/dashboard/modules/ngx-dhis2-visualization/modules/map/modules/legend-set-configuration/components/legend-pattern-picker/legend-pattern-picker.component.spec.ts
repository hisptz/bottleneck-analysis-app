import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendPatternPickerComponent } from './legend-pattern-picker.component';

describe('LegendPatternPickerComponent', () => {
  let component: LegendPatternPickerComponent;
  let fixture: ComponentFixture<LegendPatternPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendPatternPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendPatternPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
