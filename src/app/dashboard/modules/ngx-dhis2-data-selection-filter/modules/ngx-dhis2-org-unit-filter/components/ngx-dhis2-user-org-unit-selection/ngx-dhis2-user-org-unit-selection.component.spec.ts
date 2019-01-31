import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDhis2UserOrgUnitSelectionComponent } from './ngx-dhis2-user-org-unit-selection.component';

describe('NgxDhis2UserOrgUnitSelectionComponent', () => {
  let component: NgxDhis2UserOrgUnitSelectionComponent;
  let fixture: ComponentFixture<NgxDhis2UserOrgUnitSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxDhis2UserOrgUnitSelectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2UserOrgUnitSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
