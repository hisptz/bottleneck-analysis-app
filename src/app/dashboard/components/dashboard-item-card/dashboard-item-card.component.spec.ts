import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItemCardComponent } from './dashboard-item-card.component';

describe('DashboardItemCardComponent', () => {
  let component: DashboardItemCardComponent;
  let fixture: ComponentFixture<DashboardItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardItemCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
