import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDhis2OrgUnitSelectedOrgUnitComponent } from './ngx-dhis2-org-unit-selected-org-unit.component';

describe('NgxDhis2OrgUnitSelectedOrgUnitComponent', () => {
  let component: NgxDhis2OrgUnitSelectedOrgUnitComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitSelectedOrgUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDhis2OrgUnitSelectedOrgUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitSelectedOrgUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
