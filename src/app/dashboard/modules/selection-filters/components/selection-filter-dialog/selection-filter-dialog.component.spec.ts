import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionFilterDialogComponent } from './selection-filter-dialog.component';

describe('SelectionFilterDialogComponent', () => {
  let component: SelectionFilterDialogComponent;
  let fixture: ComponentFixture<SelectionFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
