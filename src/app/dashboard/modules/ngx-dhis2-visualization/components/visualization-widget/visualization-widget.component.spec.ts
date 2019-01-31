import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationWidgetComponent } from './visualization-widget.component';
import { VisualizationCardLoaderComponent } from '../visualization-card-loader/visualization-card-loader.component';
import { SafePipe } from '../../pipes/safe';
import { VisualizationErrorNotifierComponent } from '../visualization-error-notifier/visualization-error-notifier.component';
import { HttpClientModule } from '@angular/common/http';

describe('VisualizationWidgetComponent', () => {
  let component: VisualizationWidgetComponent;
  let fixture: ComponentFixture<VisualizationWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [
        VisualizationWidgetComponent,
        VisualizationCardLoaderComponent,
        VisualizationErrorNotifierComponent,
        SafePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
