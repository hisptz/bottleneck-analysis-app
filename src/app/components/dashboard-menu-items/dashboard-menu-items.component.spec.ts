import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuItemsComponent } from './dashboard-menu-items.component';

describe('DashboardMenuItemsComponent', () => {
  let component: DashboardMenuItemsComponent;
  let fixture: ComponentFixture<DashboardMenuItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
