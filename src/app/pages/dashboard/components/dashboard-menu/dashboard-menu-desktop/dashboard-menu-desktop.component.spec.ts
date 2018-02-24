import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuDesktopComponent } from './dashboard-menu-desktop.component';

describe('DashboardMenuDesktopComponent', () => {
  let component: DashboardMenuDesktopComponent;
  let fixture: ComponentFixture<DashboardMenuDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
