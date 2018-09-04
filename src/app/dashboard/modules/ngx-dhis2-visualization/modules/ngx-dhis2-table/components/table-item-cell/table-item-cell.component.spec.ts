import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableItemCellComponent } from './table-item-cell.component';

describe('TableItemCellComponent', () => {
  let component: TableItemCellComponent;
  let fixture: ComponentFixture<TableItemCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableItemCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableItemCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
