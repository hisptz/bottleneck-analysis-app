import * as _ from 'lodash';
import { getFilteredTableRows } from './get-filtered-table-rows.helper';

export function getMergedTableRowsOrColumnsDetails(
  tableDataRowsOrColumns: any,
  dxGroupMembers: any
) {
  const availableParent = {};
  const mergedDataRowsOrColumnsArray = _.map(
    getFilteredTableRows(tableDataRowsOrColumns, dxGroupMembers),
    (filteredDataRow: any[]) =>
      _.filter(
        _.map(filteredDataRow, (filterDataCell: any) => {
          if (!availableParent[filterDataCell.id]) {
            if (filterDataCell.id) {
              availableParent[filterDataCell.id] = 1;
            }
            return filterDataCell;
          }

          availableParent[filterDataCell.id] =
            availableParent[filterDataCell.id] + 1;
          return null;
        }),
        dataCell => dataCell
      )
  );

  return { availableParent, mergedDataRowsOrColumnsArray };
}
