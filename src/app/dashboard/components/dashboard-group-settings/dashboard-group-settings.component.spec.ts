import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGroupSettingsComponent } from './dashboard-group-settings.component';

describe('DashboardGroupSettingsComponent', () => {
  let component: DashboardGroupSettingsComponent;
  let fixture: ComponentFixture<DashboardGroupSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGroupSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGroupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
