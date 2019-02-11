import * as _ from 'lodash';
export function getTableHeaderRows(
  tableRow,
  tableColumnsArray,
  analyticsObject,
  tableConfiguration
) {
  let tableHeaderRows = [];

  _.each(tableColumnsArray, (tableColumn: any[], tableColumnIndex: number) => {
    const newTableColumn = _.map(
      tableColumn,
      (tableColumnCell: any, tableColumnCellIndex: number) => {
        const columnDimension =
          tableConfiguration.columns[tableColumnCellIndex];
        return {
          ...tableColumnCell,
          dimension: columnDimension,
          name: tableColumnCell.name
        };
      }
    );
    if (tableColumnIndex === 0) {
      tableHeaderRows = [
        ...tableHeaderRows,
        [
          ..._.map(tableRow, (tableRowCell: any, tableRowCellIndex: number) => {
            const rowDimension = tableConfiguration.rows[tableRowCellIndex];
            return {
              ...tableRowCell,
              dimension: rowDimension,
              name: analyticsObject.metaData.names[rowDimension],
              rowSpan: tableColumnsArray.length
            };
          }),
          ...newTableColumn
        ]
      ];
    } else {
      tableHeaderRows = [...tableHeaderRows, newTableColumn];
    }
  });

  return tableHeaderRows;
}
