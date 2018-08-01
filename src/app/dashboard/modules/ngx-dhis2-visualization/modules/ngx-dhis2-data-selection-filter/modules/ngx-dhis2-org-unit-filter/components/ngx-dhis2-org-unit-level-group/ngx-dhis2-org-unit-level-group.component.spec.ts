import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDhis2OrgUnitLevelComponent } from './ngx-dhis2-org-unit-level-group.component';

describe('NgxDhis2OrgUnitLevelComponent', () => {
  let component: NgxDhis2OrgUnitLevelComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxDhis2OrgUnitLevelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
