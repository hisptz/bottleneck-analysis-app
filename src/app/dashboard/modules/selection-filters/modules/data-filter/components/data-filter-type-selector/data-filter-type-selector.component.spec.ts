import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterTypeSelectorComponent } from './data-filter-type-selector.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DataFilterTypeSelectorComponent', () => {
  let component: DataFilterTypeSelectorComponent;
  let fixture: ComponentFixture<DataFilterTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFilterTypeSelectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
