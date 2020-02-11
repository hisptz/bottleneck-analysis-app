import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterGroupSelectorComponent } from './data-filter-group-selector.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterByNamePipe } from 'src/app/shared/pipes';
import { ScrollingModule } from '@angular/cdk/scrolling';

describe('DataFilterGroupSelectorComponent', () => {
  let component: DataFilterGroupSelectorComponent;
  let fixture: ComponentFixture<DataFilterGroupSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFilterGroupSelectorComponent, FilterByNamePipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ScrollingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
