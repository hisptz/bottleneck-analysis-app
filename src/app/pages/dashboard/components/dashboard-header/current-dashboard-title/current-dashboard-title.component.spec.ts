import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDashboardTitleComponent } from './current-dashboard-title.component';

describe('CurrentDashboardTitleComponent', () => {
  let component: CurrentDashboardTitleComponent;
  let fixture: ComponentFixture<CurrentDashboardTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDashboardTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDashboardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
