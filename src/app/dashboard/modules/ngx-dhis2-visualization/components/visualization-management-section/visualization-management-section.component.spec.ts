import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationManagementSectionComponent } from './visualization-management-section.component';
import { FormsModule } from '@angular/forms';

describe('VisualizationManagementSectionComponent', () => {
  let component: VisualizationManagementSectionComponent;
  let fixture: ComponentFixture<VisualizationManagementSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [VisualizationManagementSectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationManagementSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
