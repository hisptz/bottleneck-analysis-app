import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardMenuComponent } from './dashboard-menu.component';

describe('DasboardMenuComponent', () => {
  let component: DasboardMenuComponent;
  let fixture: ComponentFixture<DasboardMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasboardMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
