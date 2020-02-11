import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendDefinitionListComponent } from './legend-definition-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LegendDefinitionListComponent', () => {
  let component: LegendDefinitionListComponent;
  let fixture: ComponentFixture<LegendDefinitionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LegendDefinitionListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendDefinitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
