import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDashboardListComponent } from './default-dashboard-list.component';

describe('DefaultDashboardListComponent', () => {
  let component: DefaultDashboardListComponent;
  let fixture: ComponentFixture<DefaultDashboardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultDashboardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
