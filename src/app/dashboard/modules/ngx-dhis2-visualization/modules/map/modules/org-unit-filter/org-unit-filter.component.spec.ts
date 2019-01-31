import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitFilterComponent } from './org-unit-filter.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { FilterLevelPipe } from './pipes/filter-level.pipe';
import { TreeModule } from 'angular-tree-component';
import { HttpClientModule } from '@angular/common/http';

describe('OrgUnitFilterComponent', () => {
  let component: OrgUnitFilterComponent;
  let fixture: ComponentFixture<OrgUnitFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TreeModule, HttpClientModule],
      declarations: [
        OrgUnitFilterComponent,
        MultiselectComponent,
        FilterLevelPipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
