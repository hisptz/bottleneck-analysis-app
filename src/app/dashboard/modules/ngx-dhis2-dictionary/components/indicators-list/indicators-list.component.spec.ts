import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsListComponent } from './indicators-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { FilterIndicatorsByGroupIdPipe } from '../../pipes/filter-indicators-by-group-id.pipe';
import { FilterBySearchInputPipe } from '../../pipes/filter-by-search-input.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

describe('IndicatorsListComponent', () => {
  let component: IndicatorsListComponent;
  let fixture: ComponentFixture<IndicatorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [StoreModule.forRoot({}), NgxPaginationModule],
      declarations: [
        IndicatorsListComponent,
        FilterIndicatorsByGroupIdPipe,
        FilterBySearchInputPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
