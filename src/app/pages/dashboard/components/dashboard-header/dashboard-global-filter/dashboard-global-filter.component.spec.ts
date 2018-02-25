import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGlobalFilterComponent } from './dashboard-global-filter.component';

describe('DashboardGlobalFilterComponent', () => {
  let component: DashboardGlobalFilterComponent;
  let fixture: ComponentFixture<DashboardGlobalFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGlobalFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGlobalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
