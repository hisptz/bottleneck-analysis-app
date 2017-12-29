import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDashboardShareSectionComponent } from './current-dashboard-share-section.component';

describe('CurrentDashboardShareSectionComponent', () => {
  let component: CurrentDashboardShareSectionComponent;
  let fixture: ComponentFixture<CurrentDashboardShareSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDashboardShareSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDashboardShareSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
