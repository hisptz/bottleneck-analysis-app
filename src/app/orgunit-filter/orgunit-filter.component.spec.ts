import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitFilterComponent } from './orgunit-filter.component';

describe('OrgunitFilterComponent', () => {
  let component: OrgunitFilterComponent;
  let fixture: ComponentFixture<OrgunitFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
