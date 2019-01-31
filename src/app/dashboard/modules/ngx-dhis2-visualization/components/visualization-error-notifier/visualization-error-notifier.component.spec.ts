import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationErrorNotifierComponent } from './visualization-error-notifier.component';
import { SafePipe } from '../../pipes/safe';

describe('VisualizationErrorNotifierComponent', () => {
  let component: VisualizationErrorNotifierComponent;
  let fixture: ComponentFixture<VisualizationErrorNotifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizationErrorNotifierComponent, SafePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationErrorNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
