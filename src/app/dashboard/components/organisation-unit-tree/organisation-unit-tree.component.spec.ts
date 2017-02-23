import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitTreeComponent } from './organisation-unit-tree.component';

describe('OrganisationUnitTreeComponent', () => {
  let component: OrganisationUnitTreeComponent;
  let fixture: ComponentFixture<OrganisationUnitTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationUnitTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationUnitTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
