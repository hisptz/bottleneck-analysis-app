import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuListDesktopComponent } from './dashboard-menu-list-desktop.component';

describe('DashboardMenuListDesktopComponent', () => {
  let component: DashboardMenuListDesktopComponent;
  let fixture: ComponentFixture<DashboardMenuListDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuListDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuListDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
