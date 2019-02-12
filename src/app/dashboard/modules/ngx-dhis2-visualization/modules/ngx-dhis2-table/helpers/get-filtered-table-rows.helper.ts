import * as _ from 'lodash';
import { getFlattenedTableRows } from './get-flattened-table-rows.helper';
import { getMatchingTableRowsOrColumns } from './get-matching-table-rows-or-columns.helper';

export function getFilteredTableRows(tableDataRows: any, dxGroupMembers: any) {
  return _.filter(
    getFlattenedTableRows(tableDataRows),
    (tableDataRow: any[]) =>
      getMatchingTableRowsOrColumns(tableDataRow, dxGroupMembers).length > 0
  );
}
