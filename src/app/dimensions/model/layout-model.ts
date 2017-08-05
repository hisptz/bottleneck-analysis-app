export interface LayoutModel {
  type: string;
  rows: Array<{
    name: string;
    value: string;
  }>;
  columns: Array<{
    name: string;
    value: string;
  }>;
  filters: Array<{
    name: string;
    value: string;
  }>
  excluded: Array<{
    name: string;
    value: string;
  }>
}

export const INITIAL_LAYOUT_MODEL: LayoutModel = {
  type: 'table',
  rows: [{
      name: 'Period',
      value: 'pe'
    }],
  columns: [{
    name: 'Data',
    value: 'dx'
  }],
  filters: [{
    name: 'Filter',
    value: 'ou'
  }],
  excluded: [{
    name: 'Excluded Dimension',
    value: 'co'
  }]
}
