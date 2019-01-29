import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDhis2OrgUnitFilterComponent } from './ngx-dhis2-org-unit-filter.component';

describe('NgxDhis2OrgUnitFilterComponent', () => {
  let component: NgxDhis2OrgUnitFilterComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDhis2OrgUnitFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
