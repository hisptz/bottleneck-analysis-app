import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEditFormComponent } from './dashboard-edit-form.component';

describe('DashboardEditFormComponent', () => {
  let component: DashboardEditFormComponent;
  let fixture: ComponentFixture<DashboardEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
