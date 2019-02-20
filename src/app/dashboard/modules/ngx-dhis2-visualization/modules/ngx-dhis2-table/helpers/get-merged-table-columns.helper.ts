import * as _ from 'lodash';

import { getMergedTableRowsOrColumnsDetails } from './get-merged-table-rows-or-columns-details.helper';
import { getTableHeaderRowsWithDataRowIds } from './get-table-headers-rows-with-data-rows-ids.helper';
import { getFilteredTableRows } from './get-filtered-table-rows.helper';
import { getMatchingTableRowsOrColumns } from './get-matching-table-rows-or-columns.helper';

export function getMergedTableColumns(
  tableDataColumns: any,
  dxGroupMembers: any
) {
  const availableParent = {};
  const mergedTableColumnsArray = _.map(
    tableDataColumns,
    (tableDataRow: any[]) => {
      const matchingTableColumns = getMatchingTableRowsOrColumns(
        tableDataRow,
        dxGroupMembers
      );

      // TODO: FIND BEST WAY TO AVOID LOOPING
      _.each(matchingTableColumns, (matchingTableColumn: any) => {
        _.each(
          _.filter(
            matchingTableColumn.dataRowIds,
            dataRowId => dataRowId !== matchingTableColumn.id
          ),
          (dataRowId: string) => {
            if (availableParent[dataRowId]) {
              availableParent[dataRowId] = availableParent[dataRowId] + 1;
            } else {
              availableParent[dataRowId] = 1;
            }
          }
        );
      });

      return matchingTableColumns.length > 0
        ? matchingTableColumns
        : tableDataRow;
    }
  );

  return _.map(mergedTableColumnsArray, (mergedDataColumns: any[]) =>
    _.map(mergedDataColumns, (mergedDataCell: any) => {
      return {
        ...mergedDataCell,
        colSpan: availableParent[mergedDataCell.id]
      };
    })
  );
}
