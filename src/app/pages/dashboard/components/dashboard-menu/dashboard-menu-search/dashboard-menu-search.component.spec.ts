import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuSearchComponent } from './dashboard-menu-search.component';

describe('DashboardMenuSearchComponent', () => {
  let component: DashboardMenuSearchComponent;
  let fixture: ComponentFixture<DashboardMenuSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
