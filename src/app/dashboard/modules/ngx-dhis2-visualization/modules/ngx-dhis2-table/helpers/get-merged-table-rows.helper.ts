import * as _ from 'lodash';
import { getFilteredTableRows } from './get-filtered-table-rows.helper';

export function getMergedTableRows(tableDataRows: any, dxGroupMembers: any) {
  const availableParent = {};
  const mergedDataRowsArray = _.map(
    getFilteredTableRows(tableDataRows, dxGroupMembers),
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

  return _.map(mergedDataRowsArray, (mergedDataRows: any[]) =>
    _.map(mergedDataRows, (mergedDataCell: any) => {
      return {
        ...mergedDataCell,
        rowSpan: availableParent[mergedDataCell.id]
      };
    })
  );
}
