import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuItemDesktopComponent } from './dashboard-menu-item-desktop.component';

describe('DashboardMenuItemDesktopComponent', () => {
  let component: DashboardMenuItemDesktopComponent;
  let fixture: ComponentFixture<DashboardMenuItemDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuItemDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuItemDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
