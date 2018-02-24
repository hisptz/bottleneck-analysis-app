import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuDeleteComponent } from './dashboard-menu-delete.component';

describe('DashboardMenuDeleteComponent', () => {
  let component: DashboardMenuDeleteComponent;
  let fixture: ComponentFixture<DashboardMenuDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
