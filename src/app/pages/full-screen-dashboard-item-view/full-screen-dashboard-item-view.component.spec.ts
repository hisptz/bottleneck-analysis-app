import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenDashboardItemViewComponent } from './full-screen-dashboard-item-view.component';

describe('FullScreenDashboardItemViewComponent', () => {
  let component: FullScreenDashboardItemViewComponent;
  let fixture: ComponentFixture<FullScreenDashboardItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScreenDashboardItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenDashboardItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
