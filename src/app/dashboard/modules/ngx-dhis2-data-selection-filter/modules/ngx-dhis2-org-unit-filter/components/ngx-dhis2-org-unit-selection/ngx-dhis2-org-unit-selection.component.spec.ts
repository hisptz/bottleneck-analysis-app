import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDhis2OrgUnitSelectionComponent } from './ngx-dhis2-org-unit-selection.component';

describe('NgxDhis2OrgUnitSelectionComponent', () => {
  let component: NgxDhis2OrgUnitSelectionComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDhis2OrgUnitSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
