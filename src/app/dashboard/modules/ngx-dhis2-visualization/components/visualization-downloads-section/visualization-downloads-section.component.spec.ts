import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationDownloadsSectionComponent } from './visualization-downloads-section.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VisualizationDownloadsSectionComponent', () => {
  let component: VisualizationDownloadsSectionComponent;
  let fixture: ComponentFixture<VisualizationDownloadsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizationDownloadsSectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationDownloadsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
