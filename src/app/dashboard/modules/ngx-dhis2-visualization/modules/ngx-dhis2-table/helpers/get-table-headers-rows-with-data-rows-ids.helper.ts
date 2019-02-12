import * as _ from 'lodash';
export function getTableHeaderRowsWithDataRowIds(
  tableHeaderRowsArray: Array<any[]>
) {
  return _.map(tableHeaderRowsArray, (tableHeaderRows: any[]) =>
    _.map(tableHeaderRows, (tableHeaderRow: any) => {
      if (!tableHeaderRow) {
        return null;
      }
      const dataRowIds = tableHeaderRow.path
        ? tableHeaderRow.path.split('/')
        : [];
      return dataRowIds.length > 1
        ? {
            ...tableHeaderRow,
            dataRowIds
          }
        : tableHeaderRow;
    })
  );
}
