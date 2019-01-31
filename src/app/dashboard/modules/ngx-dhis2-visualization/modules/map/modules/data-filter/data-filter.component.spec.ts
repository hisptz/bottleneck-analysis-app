import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterComponent } from './data-filter.component';
import { FormsModule } from '@angular/forms';
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddUnderscorePipe } from './pipes/add-underscore.pipe';
import { HttpClientModule } from '@angular/common/http';

describe('DataFilterComponent', () => {
  let component: DataFilterComponent;
  let fixture: ComponentFixture<DataFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgxPaginationModule, HttpClientModule],
      declarations: [DataFilterComponent, FilterByNamePipe, AddUnderscorePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
