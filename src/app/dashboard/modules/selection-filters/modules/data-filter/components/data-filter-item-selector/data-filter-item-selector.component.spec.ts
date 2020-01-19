import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterItemSelectorComponent } from './data-filter-item-selector.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DataFilterItemSelectorComponent', () => {
  let component: DataFilterItemSelectorComponent;
  let fixture: ComponentFixture<DataFilterItemSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFilterItemSelectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
