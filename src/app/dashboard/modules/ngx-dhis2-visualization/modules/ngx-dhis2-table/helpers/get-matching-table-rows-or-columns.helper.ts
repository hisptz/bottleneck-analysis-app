import * as _ from 'lodash';
export function getMatchingTableRowsOrColumns(
  tableDataRowOrColumn: any[],
  dxGroupMembers: any
) {
  return _.filter(
    _.filter(
      tableDataRowOrColumn,
      (tableDataCell: any) => tableDataCell.dataRowIds
    ),
    (tableDataCell: any) =>
      _.some(
        dxGroupMembers,
        (dxGroupMember: any[]) =>
          _.intersection(tableDataCell.dataRowIds, dxGroupMember).length ===
          dxGroupMember.length
      )
  );
}
