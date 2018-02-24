import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardHeaderComponent } from './dashboard-header.component';

describe('DasboardHeaderComponent', () => {
  let component: DasboardHeaderComponent;
  let fixture: ComponentFixture<DasboardHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasboardHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
