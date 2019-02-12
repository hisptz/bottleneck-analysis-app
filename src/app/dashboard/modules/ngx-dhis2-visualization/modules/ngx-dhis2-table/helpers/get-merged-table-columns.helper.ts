import * as _ from 'lodash';

import { getMergedTableRowsOrColumnsDetails } from './get-merged-table-rows-or-columns-details.helper';
import { getTableHeaderRowsWithDataRowIds } from './get-table-headers-rows-with-data-rows-ids.helper';
import { getFilteredTableRows } from './get-filtered-table-rows.helper';

export function getMergedTableColumns(
  tableDataColumns: any,
  dxGroupMembers: any
) {
  const {
    availableParent,
    mergedDataRowsOrColumnsArray
  } = getMergedTableRowsOrColumnsDetails(tableDataColumns, dxGroupMembers);

  return _.map(mergedDataRowsOrColumnsArray, (mergedDataRows: any[]) =>
    _.map(mergedDataRows, (mergedDataCell: any) => {
      return {
        ...mergedDataCell,
        colSpan: availableParent[mergedDataCell.id]
      };
    })
  );
}
