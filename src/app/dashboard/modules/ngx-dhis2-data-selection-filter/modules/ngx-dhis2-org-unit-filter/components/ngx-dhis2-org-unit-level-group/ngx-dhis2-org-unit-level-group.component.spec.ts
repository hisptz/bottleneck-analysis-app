import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDhis2OrgUnitLevelGroupComponent } from './ngx-dhis2-org-unit-level-group.component';
import { NgxDhis2OrgUnitProgressComponent } from '../ngx-dhis2-org-unit-progress/ngx-dhis2-org-unit-progress.component';
import { FilterByOrgUnitGroupLevelPipe } from '../../pipes';

describe('NgxDhis2OrgUnitLevelGroupComponent', () => {
  let component: NgxDhis2OrgUnitLevelGroupComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitLevelGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NgxDhis2OrgUnitLevelGroupComponent,
        NgxDhis2OrgUnitProgressComponent,
        FilterByOrgUnitGroupLevelPipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitLevelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
