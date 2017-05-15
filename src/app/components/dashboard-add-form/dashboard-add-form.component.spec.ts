import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddFormComponent } from './dashboard-add-form.component';

describe('DashboardAddFormComponent', () => {
  let component: DashboardAddFormComponent;
  let fixture: ComponentFixture<DashboardAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
