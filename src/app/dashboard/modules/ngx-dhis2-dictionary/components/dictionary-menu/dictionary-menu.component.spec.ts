import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryMenuComponent } from './dictionary-menu.component';
import { FilterBySearchInputPipe } from '../../pipes/filter-by-search-input.pipe';

describe('DictionaryMenuComponent', () => {
  let component: DictionaryMenuComponent;
  let fixture: ComponentFixture<DictionaryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DictionaryMenuComponent, FilterBySearchInputPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionaryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
