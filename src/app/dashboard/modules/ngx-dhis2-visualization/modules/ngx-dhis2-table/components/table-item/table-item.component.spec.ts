import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableItemComponent } from './table-item.component';
import { TableItemCellComponent } from '../table-item-cell/table-item-cell.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TableItemComponent', () => {
  let component: TableItemComponent;
  let fixture: ComponentFixture<TableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [TableItemComponent, TableItemCellComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
