import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNotificationBlockComponent } from './dashboard-notification-block.component';

describe('DashboardNotificationBlockComponent', () => {
  let component: DashboardNotificationBlockComponent;
  let fixture: ComponentFixture<DashboardNotificationBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNotificationBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNotificationBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
