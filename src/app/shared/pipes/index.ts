import { FilterByNamePipe } from './filter-by-name.pipe';
import { SafePipe } from './safe';
import { RemoveSelectedItemsPipe } from './remove-selected-items.pipe';

export const pipes: any[] = [
  FilterByNamePipe,
  SafePipe,
  RemoveSelectedItemsPipe,
];

export * from './filter-by-name.pipe';
export * from './safe';
