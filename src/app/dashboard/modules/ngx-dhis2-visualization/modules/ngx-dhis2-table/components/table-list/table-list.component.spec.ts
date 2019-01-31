import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListComponent } from './table-list.component';
import { TableItemComponent } from '../table-item/table-item.component';
import { TableItemCellComponent } from '../table-item-cell/table-item-cell.component';

describe('TableListComponent', () => {
  let component: TableListComponent;
  let fixture: ComponentFixture<TableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableListComponent,
        TableItemComponent,
        TableItemCellComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
