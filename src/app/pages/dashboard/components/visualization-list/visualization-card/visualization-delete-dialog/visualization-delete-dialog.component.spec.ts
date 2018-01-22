import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationDeleteDialogComponent } from './visualization-delete-dialog.component';

describe('VisualizationDeleteDialogComponent', () => {
  let component: VisualizationDeleteDialogComponent;
  let fixture: ComponentFixture<VisualizationDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
