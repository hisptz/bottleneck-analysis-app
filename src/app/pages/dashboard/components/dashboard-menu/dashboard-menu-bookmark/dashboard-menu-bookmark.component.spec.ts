import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuBookmarkComponent } from './dashboard-menu-bookmark.component';

describe('DashboardMenuBookmarkComponent', () => {
  let component: DashboardMenuBookmarkComponent;
  let fixture: ComponentFixture<DashboardMenuBookmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuBookmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
