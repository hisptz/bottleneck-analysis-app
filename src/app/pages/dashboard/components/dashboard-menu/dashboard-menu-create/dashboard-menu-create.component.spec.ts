import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuCreateComponent } from './dashboard-menu-create.component';

describe('DashboardMenuCreateComponent', () => {
  let component: DashboardMenuCreateComponent;
  let fixture: ComponentFixture<DashboardMenuCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMenuCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMenuCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
