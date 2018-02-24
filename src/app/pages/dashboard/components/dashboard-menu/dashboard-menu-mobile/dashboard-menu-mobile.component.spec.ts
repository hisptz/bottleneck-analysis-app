import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuMobileComponent } from './dashboard-menu-mobile.component';

describe('DashboardMenuMobileComponent', () => {
  let component: DashboardMenuMobileComponent;
  let fixture: ComponentFixture<DashboardMenuMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
