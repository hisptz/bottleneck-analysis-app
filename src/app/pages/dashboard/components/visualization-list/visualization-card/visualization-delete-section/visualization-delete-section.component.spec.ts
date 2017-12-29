import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationDeleteSectionComponent } from './visualization-delete-section.component';

describe('VisualizationDeleteSectionComponent', () => {
  let component: VisualizationDeleteSectionComponent;
  let fixture: ComponentFixture<VisualizationDeleteSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationDeleteSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationDeleteSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
