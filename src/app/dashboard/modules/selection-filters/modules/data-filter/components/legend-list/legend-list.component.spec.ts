import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendListComponent } from './legend-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LegendListComponent', () => {
  let component: LegendListComponent;
  let fixture: ComponentFixture<LegendListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LegendListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
