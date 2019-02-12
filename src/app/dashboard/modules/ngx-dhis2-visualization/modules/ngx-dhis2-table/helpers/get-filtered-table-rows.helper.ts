import * as _ from 'lodash';
import { getFlattenedTableRows } from './get-flattened-table-rows.helper';

export function getFilteredTableRows(tableDataRows: any, dxGroupMembers: any) {
  return _.filter(
    getFlattenedTableRows(tableDataRows),
    (tableDataRow: any[]) => {
      const matchingDataRows = _.filter(
        _.filter(
          tableDataRow,
          (tableDataCell: any) => tableDataCell.dataRowIds
        ),
        (tableDataCell: any) => {
          const intersectedRows = _.filter(
            dxGroupMembers,
            (dxGroupMember: any[]) => {
              return (
                _.intersection(tableDataCell.dataRowIds, dxGroupMember)
                  .length === dxGroupMember.length
              );
            }
          );

          return intersectedRows.length > 0;
        }
      );

      return matchingDataRows.length > 0;
    }
  );
}
