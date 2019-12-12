import { DataFilterSelection } from '../models/data-filter-selection.model';

export const DATA_FILTER_SELECTIONS: DataFilterSelection[] = [
  {
    name: 'All',
    prefix: 'all',
    selected: true
  },
  {
    name: 'Data elements',
    prefix: 'de',
    selected: false
  },
  {
    name: 'Indicators',
    prefix: 'in',
    selected: false
  },
  {
    name: 'Data sets',
    prefix: 'ds',
    selected: false
  },
  {
    name: 'Program indicators',
    prefix: 'pr',
    selected: false
  },
  {
    name: 'Functions',
    prefix: 'fn',
    selected: false
  }
];
