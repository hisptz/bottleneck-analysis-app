import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDashboardDescriptionComponent } from './current-dashboard-description.component';

describe('CurrentDashboardDescriptionComponent', () => {
  let component: CurrentDashboardDescriptionComponent;
  let fixture: ComponentFixture<CurrentDashboardDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDashboardDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDashboardDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
