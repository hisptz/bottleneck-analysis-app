import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDashboardBookmarkButtonComponent } from './current-dashboard-bookmark-button.component';

describe('CurrentDashboardBookmarkButtonComponent', () => {
  let component: CurrentDashboardBookmarkButtonComponent;
  let fixture: ComponentFixture<CurrentDashboardBookmarkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDashboardBookmarkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDashboardBookmarkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
