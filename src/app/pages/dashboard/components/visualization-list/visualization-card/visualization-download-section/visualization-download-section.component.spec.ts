import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationDownloadSectionComponent } from './visualization-download-section.component';

describe('VisualizationDownloadSectionComponent', () => {
  let component: VisualizationDownloadSectionComponent;
  let fixture: ComponentFixture<VisualizationDownloadSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationDownloadSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationDownloadSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
