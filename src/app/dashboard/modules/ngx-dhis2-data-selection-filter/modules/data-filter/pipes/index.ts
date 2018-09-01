import { AddUnderscorePipe } from './add-underscore.pipe';
import { FilterByNamePipe } from './filter-by-name.pipe';
import { OrderPipe } from './order-by.pipe';
import { RemoveSelectedItemsPipe } from './remove-selected-items.pipe';

export const pipes: any[] = [
  AddUnderscorePipe,
  FilterByNamePipe,
  OrderPipe,
  RemoveSelectedItemsPipe
];
