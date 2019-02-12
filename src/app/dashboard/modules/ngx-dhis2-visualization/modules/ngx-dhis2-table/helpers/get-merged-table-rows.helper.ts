import * as _ from 'lodash';

import { getMergedTableRowsOrColumnsDetails } from './get-merged-table-rows-or-columns-details.helper';

export function getMergedTableRows(tableDataRows: any, dxGroupMembers: any) {
  const {
    availableParent,
    mergedDataRowsOrColumnsArray
  } = getMergedTableRowsOrColumnsDetails(tableDataRows, dxGroupMembers);

  return _.map(mergedDataRowsOrColumnsArray, (mergedDataRows: any[]) =>
    _.map(mergedDataRows, (mergedDataCell: any) => {
      return {
        ...mergedDataCell,
        rowSpan: availableParent[mergedDataCell.id]
      };
    })
  );
}
