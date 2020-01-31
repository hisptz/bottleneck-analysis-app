import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

import { DataFilterItemSelectorComponent } from './data-filter-item-selector.component';

describe('DataFilterItemSelectorComponent', () => {
  let component: DataFilterItemSelectorComponent;
  let fixture: ComponentFixture<DataFilterItemSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataFilterItemSelectorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [BrowserAnimationsModule, SharedModule],
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
