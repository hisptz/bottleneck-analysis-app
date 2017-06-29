import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNotificationAreaComponent } from './dashboard-notification-area.component';

describe('DashboardNotificationAreaComponent', () => {
  let component: DashboardNotificationAreaComponent;
  let fixture: ComponentFixture<DashboardNotificationAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNotificationAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNotificationAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
