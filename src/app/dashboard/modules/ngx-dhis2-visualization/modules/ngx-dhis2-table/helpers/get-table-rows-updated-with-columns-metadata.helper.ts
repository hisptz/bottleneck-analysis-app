import * as _ from 'lodash';
import { TableConfiguration } from '../models/table-configuration';

export function getTableRowsUpdatedWithColumnsMetadata(
  tableConfiguration: TableConfiguration,
  tableRowsArray: any,
  tableColumnsArray: any
) {
  return _.map(tableRowsArray, (tableRow: any[]) => {
    return [
      ...tableRow,
      ..._.map(_.last(tableColumnsArray), (tableDataCell: any) => {
        const lastTableRow = _.last(tableRow);
        const rowPaths =
          lastTableRow && lastTableRow.path ? lastTableRow.path.split('/') : [];
        const columnPaths =
          tableDataCell && tableDataCell.path
            ? tableDataCell.path.split('/')
            : [];

        const dataRowIds = [...rowPaths, ...columnPaths];
        return {
          id: dataRowIds.join('_'),
          isDataCell: true,
          dataDimensions: [
            ...tableConfiguration.rows,
            ...tableConfiguration.columns
          ],
          dataRowIds
        };
      })
    ];
  });
}
