import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItemSearchComponent } from './dashboard-item-search.component';

describe('DashboardItemSearchComponent', () => {
  let component: DashboardItemSearchComponent;
  let fixture: ComponentFixture<DashboardItemSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardItemSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
