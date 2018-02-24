import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationInterpretationButtonComponent } from './visualization-interpretation-button.component';

describe('VisualizationInterpretationButtonComponent', () => {
  let component: VisualizationInterpretationButtonComponent;
  let fixture: ComponentFixture<VisualizationInterpretationButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationInterpretationButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationInterpretationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
