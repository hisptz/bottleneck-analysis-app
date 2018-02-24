import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuEditComponent } from './dashboard-menu-edit.component';

describe('DashboardMenuEditComponent', () => {
  let component: DashboardMenuEditComponent;
  let fixture: ComponentFixture<DashboardMenuEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
